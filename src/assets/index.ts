// Export all images from assets folder
import cycleImage from './cycle.webp'
import reactLogo from './react.svg'
// Add your new images here - update these paths to match your actual image files
import heroImage from './enviroment.jpg'
import stiTestsImage from './sti-test.jpeg'
import consultationImage from './consultation.jpg'
import howItWorksImage from './how-it-works.png'

// Create an images object with all your assets
export const images = {
  cycle: cycleImage,
  reactLogo: reactLogo,
  hero: heroImage,
  stiTests: stiTestsImage,
  consultation: consultationImage,
  howItWorks: howItWorksImage,
}

// Export individual images
export { cycleImage, reactLogo, heroImage, stiTestsImage, consultationImage, howItWorksImage }

// Default export with all images
export default images