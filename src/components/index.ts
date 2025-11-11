/**
 * Component Barrel Export
 *
 * Provides centralized exports for all components.
 * Use this to import multiple components from a single location.
 *
 * Example:
 *   import { About, Experience, Projects } from '@components';
 *
 * Note: Travel and PlaySnake are intentionally excluded to preserve
 * lazy-loading and code-splitting in routes.tsx.
 */

// Main sections - organized by feature
export { About, Experience, Skills } from "./About";
export { Contact, ContactSuccessModal } from "./Contact";
export { Projects } from "./Portfolio";

// Layout components
export { Navbar } from "./Navbar";
export { Footer } from "./Footer";

// Feature components
export { ResumePage } from "./Resume";
export { AIChatAssistant } from "./AIChatAssistant";

// Utility components
export { ErrorBoundary } from "./ErrorBoundary";
export { ScrollToHash } from "./ScrollToHash";

// Shared components
export { Button } from "./shared/Button";
export { Alert } from "./shared/Alert";
export { SocialLinks } from "./shared/SocialLinks";
export { VideoPlayer } from "./shared/VideoPlayer";
export { MonogramOverlap } from "./shared/MonogramLogo";
export { ScrollToTopButton } from "./shared/ScrollToTopButton";
export { Modal } from "./shared/Modal";
export { ConfirmDialog } from "./shared/ConfirmDialog";
export { ToastContainer } from "./shared/ToastContainer";
export { ImageWithLoader } from "./shared/ImageWithLoader";

// Travel sub-components
export { TripCard } from "./Travel/TripCard";
export { TripNavigation } from "./Travel/TripNavigation";
export { PhotoGallery } from "./Travel/PhotoGallery";

// AI Chat sub-components (for advanced usage)
export { ChatWindow } from "./AIChatAssistant/ChatWindow";
export { ChatMessage } from "./AIChatAssistant/ChatMessage";
export { ChatInput } from "./AIChatAssistant/ChatInput";
export { ChatHeader } from "./AIChatAssistant/ChatHeader";
export { SuggestedQuestions } from "./AIChatAssistant/SuggestedQuestions";
export { LoadingIndicator } from "./AIChatAssistant/LoadingIndicator";
