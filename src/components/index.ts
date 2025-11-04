/**
 * Component Barrel Export
 *
 * Provides centralized exports for all components.
 * Use this to import multiple components from a single location.
 *
 * Example:
 *   import { About, Experience, Projects } from '@components';
 */

// Main sections
export { About } from "./About";
export { Experience } from "./Experience";
export { Projects } from "./Projects";
export { Skills } from "./Skills";
export { Contact } from "./Contact";
export { default as Travel } from "./Travel";

// Layout components
export { Navbar } from "./Navbar";
export { Footer } from "./Footer";

// Feature components
export { default as Resume } from "./Resume";
export { default as Snake } from "./Snake";
export { AIChatAssistant } from "./AIChatAssistant";

// Utility components
export { ErrorBoundary } from "./ErrorBoundary";
export { ScrollToHash } from "./ScrollToHash";

// Shared components (re-export from shared folder)
export { Button } from "./shared/Button";
export { Alert } from "./shared/Alert";
export { SocialLinks } from "./shared/SocialLinks";
export { VideoPlayer } from "./shared/VideoPlayer";
export { MonogramOverlap } from "./shared/MonogramLogo";
export { ScrollToTopButton } from "./shared/ScrollToTopButton";

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
