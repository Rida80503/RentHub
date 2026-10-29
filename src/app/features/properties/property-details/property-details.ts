import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth.service';
import { PropertyService } from '../../../services/property.service';
import {
  Property,
  PropertyComment
} from '../../../shared/models/property.model';
import { User } from '../../../shared/models/user.model';

/**
 * Displays property details and allows eligible users to discuss
 * the property through messages and replies.
 */
@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './property-details.html',
  styleUrl: './property-details.css'
})
export class PropertyDetails implements OnInit {
  /** The property currently being displayed. */
  property: Property | undefined;

  /** The currently authenticated user, if available. */
  currentUser: User | null = null;

  /** Stores all comments and replies associated with the property. */
  comments: PropertyComment[] = [];

  /** Holds the text entered for a new discussion message. */
  message = '';

  /** Holds the text entered for a reply to an existing comment. */
  replyMessage = '';

  /** ID of the comment currently selected for replying to. */
  replyToId: string | null = null;

  /** Feedback messages displayed after errors or successful actions. */
  errorMessage = '';
  successMessage = '';

  /** Fallback image used when a property image is unavailable. */
  readonly defaultPropertyImage =
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85';

  /**
   * Injects route information, navigation, authentication,
   * and property management services.
   */
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly propertyService: PropertyService
  ) {}

  /**
   * Initializes the current user and retrieves the property ID
   * from the query parameters or route parameters.
   * Loads the property and its comments when the property exists.
   */
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    const propertyId =
      this.route.snapshot.queryParamMap.get('id') ??
      this.route.snapshot.paramMap.get('id');

    if (!propertyId) {
      this.property = undefined;
      return;
    }

    this.property = this.propertyService.getPropertyById(propertyId);

    if (this.property) {
      this.loadComments();
    }
  }

  /** Returns whether a user is currently authenticated. */
  get isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Checks whether the authenticated landlord owns the displayed property.
   */
  get isOwner(): boolean {
    return (
      this.currentUser?.role === 'landlord' &&
      this.currentUser.id === this.property?.ownerId
    );
  }

  /**
   * Determines whether the current user can participate in the discussion.
   * Tenants and the landlord who owns the property are eligible.
   */
  get canDiscuss(): boolean {
    return (
      this.currentUser?.role === 'tenant' ||
      this.isOwner
    );
  }

  /**
   * Finds the landlord who owns the displayed property using
   * the locally stored user records.
   * Returns undefined if the property is unavailable or the data
   * cannot be retrieved or parsed.
   */
  get landlord(): User | undefined {
    if (!this.property) {
      return undefined;
    }

    try {
      const storedUsers = localStorage.getItem('renthub_users');

      if (!storedUsers) {
        return undefined;
      }

      const users = JSON.parse(storedUsers) as User[];

      return users.find((user) => user.id === this.property?.ownerId);
    } catch {
      return undefined;
    }
  }

  /**
   * Loads comments for the displayed property.
   * Clears the comments list if no property is selected.
   */
  loadComments(): void {
    if (!this.property) {
      this.comments = [];
      return;
    }

    this.comments = this.propertyService.getComments(this.property.id);
  }

  /** Returns top-level comments that are not replies to other comments. */
  getRootComments(): PropertyComment[] {
    return this.comments.filter((comment) => !comment.parentCommentId);
  }

  /**
   * Returns replies associated with the specified parent comment.
   * @param commentId ID of the comment whose replies are requested.
   */
  getReplies(commentId: string): PropertyComment[] {
    return this.comments.filter(
      (comment) => comment.parentCommentId === commentId
    );
  }

  /**
   * Opens the reply form for a selected comment and clears previous feedback.
   * @param comment The comment selected for replying to.
   */
  startReply(comment: PropertyComment): void {
    this.replyToId = comment.id;
    this.replyMessage = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  /** Cancels the current reply and clears its input and error message. */
  cancelReply(): void {
    this.replyToId = null;
    this.replyMessage = '';
    this.errorMessage = '';
  }

  /**
   * Validates and submits a new discussion message.
   * Checks property availability, authentication, user permissions,
   * and message length before saving the comment.
   */
  sendMessage(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.property) {
      this.errorMessage = 'Property could not be found.';
      return;
    }

    if (!this.currentUser) {
      this.errorMessage = 'Please log in before posting a message.';
      return;
    }

    if (!this.canDiscuss) {
      this.errorMessage =
        'Only tenants and the landlord who owns this property can participate.';
      return;
    }

    // Remove leading and trailing whitespace before validating the message.
    const text = this.message.trim();

    if (!text) {
      this.errorMessage = 'Please enter a message first.';
      return;
    }

    if (text.length > 1000) {
      this.errorMessage = 'Your message cannot exceed 1000 characters.';
      return;
    }

    // Save the new comment with the current user's identity and property ID.
    this.propertyService.addComment({
      propertyId: this.property.id,
      authorId: this.currentUser.id,
      authorName: this.currentUser.name,
      message: text
    });

    // Clear the input, refresh the discussion, and show confirmation.
    this.message = '';
    this.loadComments();
    this.successMessage = 'Your message has been posted.';
  }

  /**
   * Validates and submits a reply to the selected discussion comment.
   * Ensures the property, user, permissions, parent comment, and reply
   * content are valid before saving.
   */
  sendReply(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.property) {
      this.errorMessage = 'Property could not be found.';
      return;
    }

    if (!this.currentUser) {
      this.errorMessage = 'Please log in before replying.';
      return;
    }

    if (!this.canDiscuss) {
      this.errorMessage =
        'Only tenants and the landlord who owns this property can reply.';
      return;
    }

    if (!this.replyToId) {
      this.errorMessage = 'Select a discussion message to reply to.';
      return;
    }

    // Normalize the reply text before checking its validity.
    const text = this.replyMessage.trim();

    if (!text) {
      this.errorMessage = 'Please enter your reply first.';
      return;
    }

    if (text.length > 1000) {
      this.errorMessage = 'Your reply cannot exceed 1000 characters.';
      return;
    }

    // Save the reply with its parent comment ID to preserve the thread.
    this.propertyService.addComment({
      propertyId: this.property.id,
      authorId: this.currentUser.id,
      authorName: this.currentUser.name,
      message: text,
      parentCommentId: this.replyToId
    });

    // Reset the reply form and reload the discussion.
    this.replyMessage = '';
    this.replyToId = null;
    this.loadComments();
    this.successMessage = 'Your reply has been posted.';
  }

  /** Logs out the current user and redirects to the home page. */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}