// src/components/widgets/SampleWidget/README.ts

import { WidgetReadme } from '../types/WidgetReadme';

export const SampleWidgetReadme: WidgetReadme = {
  // One sentence hook that makes people want to try your widget
  // Examples: 
  // - "Stop breaking promises to yourself. Build habits that actually stick with visual streak tracking."
  // - "Your full Gmail experience, right on your dashboard."
  // - "Fresh research delivered daily."
  tagline: "[Your compelling one-sentence hook here]",
  
  // 2-3 sentences explaining what your widget does and why it's different/better
  // Focus on the problem you're solving and the unique value you provide
  // Avoid technical jargon - write for your end users
  description: "[Explain what your widget does and why users will love it. Focus on benefits, not features.]",
  
  // 4-8 bullet points highlighting key functionality
  // Write these as benefits to the user, not just feature lists
  // Examples: "Secure OAuth sign-in" not just "OAuth integration"
  features: [
    "[Key feature that solves a user problem]",
    "[Another important capability]",
    "[Something that makes you different from alternatives]",
    "[Feature that saves time or reduces friction]",
    // Add 2-4 more features as needed
  ],
  
  // 3-5 specific scenarios where someone would use your widget
  // Be concrete - "Students writing literature reviews" not "People who need research"
  // Think about different user types and motivations
  useCases: [
    "[Specific type of person with specific need]",
    "[Different user type with different use case]", 
    "[Third scenario covering another audience]",
    // Add more if your widget serves diverse needs
  ],
  
  // Honest estimate of time from install to first value
  // Examples: "30 seconds", "2 min setup", "Plug and Play"
  setupTime: "[Realistic setup time estimate]",
  
  // What do users need to have/do to use your widget?
  // Examples: ["Google account"], ["Works instantly - no account needed"], []
  requirements: [
    // List any accounts, permissions, or setup requirements
    // Use empty array [] if no requirements
  ],
  
  // Your current version number
  version: "[Your version number]",
  
  // Recent improvements users might care about
  // Focus on user-facing changes, not internal code changes
  recentUpdates: [
    "[Recent improvement users would notice]",
    "[Bug fix or new feature]",
    "[Performance improvement]",
    // Keep this list to 3-4 most recent/important items
  ],

  // Your information as the developer
  developer: {
    name: "[Your name or organization]",
    url: "[Your website or portfolio URL]",
    contact: "[Your email for support/feedback]"
  },
  
  // Pricing structure
  pricing: { 
    type: 'free' // or 'paid', 'freemium', etc.
    // If paid, add: amount: number, currency: string, billing: 'monthly' | 'yearly' | 'one-time'
  },
  
  // Tags for discovery - be specific and use terms people search for
  // Look at existing widget tags for consistency
  tags: ["[primary-category]", "[secondary-category]", "[feature-tag]", "[use-case-tag]"],
  
  // When you last updated this README
  lastUpdated: "[YYYY-MM-DD]",

  // Optional fields - only include if relevant:
  
  // If your widget has achieved special recognition
  // badges: ["most-popular", "staff-pick", "trending"],
  
  // If you have user ratings/reviews
  // rating: 4.9,
  // reviewCount: 2156,
  // downloadCount: 18750,
  
  // If you want to showcase your widget visually
  // screenshots: [
  //   {
  //     url: "/widget-screenshots/[your-widget]-main.png",
  //     caption: "Brief description of what this shows",
  //     alt: "Accessible description for screen readers"
  //   }
  // ],
  
  // Platform compatibility notes
  // compatibility: ["alfred_ v2.0+", "Modern browsers", "Mobile responsive"],
};

// Export with consistent naming for discovery
export { SampleWidgetReadme as README };
export default SampleWidgetReadme;