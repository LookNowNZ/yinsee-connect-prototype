# YinSee Connect - Tester's Package & Guide

## Overview
YinSee Connect is a prototype service marketplace app currently in **mock mode**. All data is stored locally in your browser using localStorage - no server backend is required. This build includes all core functionality for comprehensive testing.

## Build Information
- **Version**: Prototype v1.0
- **Mode**: Mock/Demo (localStorage-based)
- **Platform**: Web application optimized for mobile browsers
- **Access**: Available via browser on desktop and mobile devices
- **Installation**: Can be added to home screen for app-like experience

## Pages Included (6 Total)
1. **Landing Page** - Main entry point with call-to-action buttons
2. **Browse** - View and connect to available service requests
3. **Post Request** - Create new service requests
4. **Account** - View your requests, activity, and manage data
5. **Provider Dashboard** - Manage provider profile, wallet, and services
6. **Stats** - View activity logs and usage statistics

## Testing Flows

### Provider Flow Testing
1. **Create Provider Profile**
   - Navigate to Provider Dashboard
   - Fill out provider registration form
   - Verify unique provider ID is generated
   - Confirm profile saves to localStorage

2. **Wallet Management**
   - Test "Top up +5 (mock)" button
   - Verify wallet balance increases by 5 credits
   - Check activity log records the top-up

3. **Connect to Requests**
   - Go to Browse page
   - Click "Connect" on any available request
   - Confirm 3 credits are deducted from wallet
   - Verify status changes to "Connected"
   - Check activity log records the connection

4. **Reset Profile**
   - Use "Reset provider profile" button
   - Confirm warning dialog appears with large warning icon
   - Test both "Cancel" and "Reset now" options
   - Verify all provider data is cleared on reset

### User Flow Testing
1. **Post Service Request**
   - Navigate to Post Request page
   - Fill out category, description, and location
   - Submit request and verify it appears in Account page
   - Check status shows as "Available"

2. **Browse and Connect**
   - View requests on Browse page
   - Test "Use my location" functionality (requires location permission)
   - Connect to requests and verify credit deduction

3. **Feedback System**
   - After connecting, leave feedback via feedback dialog
   - Rate experience (1-5 stars) and add optional comment
   - Verify feedback saves and appears in Recent Feedback section

4. **Account Management**
   - View "My Requests" section with status badges
   - Check "Recent Activity" displays correctly
   - Test "Reset app data" with confirmation dialog

## Visual & Accessibility Checks

### Button & Form Testing
- **Hover States**: All buttons should brighten on hover with subtle glow
- **Focus States**: Keyboard navigation shows clear focus rings
- **Contrast**: All text readable in bright daylight conditions
- **Tap Targets**: All interactive elements minimum 44px height
- **Form Fields**: Visible backgrounds with accent color borders on focus

### Dialog Testing
- **Confirmation Dialogs**: Appear for connections and resets
- **Visual Distinction**: Dialogs clearly separated from background
- **Mobile Readability**: Text and buttons legible on small screens
- **Warning Icons**: Large, left-aligned, high contrast red icons

### Status & Activity Testing
- **Status Badges**: "Available" (green), "Connected" (accent blue)
- **Recent Activity**: Readable text with proper timestamps
- **Activity Icons**: Clear icons for different activity types
- **Responsive Layout**: Proper display on various screen sizes

## Tester Tasks Checklist

### Core Functionality
- [ ] Create provider profile and verify unique ID generation
- [ ] Top up wallet and confirm balance increase
- [ ] Post service request and verify it appears in listings
- [ ] Connect to request and confirm 3 credit deduction
- [ ] Leave feedback and verify it saves correctly
- [ ] Check status flags update from "Available" to "Connected"
- [ ] Test reset functionality with proper warnings

### User Experience
- [ ] Navigate between all 6 pages smoothly
- [ ] Test "Use my location" on Browse and Taxi Request pages
- [ ] Verify all forms submit correctly with validation
- [ ] Check Recent Activity displays chronologically
- [ ] Test responsive design on different screen sizes

### Accessibility & Visual
- [ ] Confirm all buttons have proper hover/focus states
- [ ] Verify text contrast is sufficient in bright conditions
- [ ] Check all tap targets meet 44px minimum requirement
- [ ] Test keyboard navigation with visible focus rings
- [ ] Confirm warning dialogs are clear and prominent

## Known Limitations (Mock Mode)
- All data stored locally in browser (localStorage)
- No real payment processing or server integration
- Location services simulate nearest city selection
- Credit system is for demonstration only
- No real-time updates between users

## Testing Notes Section
**Tester Name**: ________________  
**Device/Browser**: ________________  
**Test Date**: ________________

### Issues Found:
\`\`\`
[Space for tester to document any bugs, UI issues, or functionality problems]
\`\`\`

### Suggestions:
\`\`\`
[Space for tester to provide feedback on user experience and improvements]
\`\`\`

### Overall Rating:
- Functionality: ___/10
- User Experience: ___/10
- Visual Design: ___/10
- Mobile Usability: ___/10

## Technical Details
- **Framework**: Next.js with React
- **Styling**: Tailwind CSS with custom global styles
- **Storage**: Browser localStorage for all mock data
- **Fonts**: Playfair Display (headings), Source Sans 3 (body)
- **Accessibility**: WCAG AA compliant with proper ARIA labels

---

**End of Testing Guide**  
For technical support or questions, refer to the development team.
