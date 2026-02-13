// import About from "../components/About";
// import Footer from "../components/Footer";
// import MobileApp from "../components/MobileApp";
// import Nav from "../components/Nav";
import SEO from "../components/SEO";
// import Solutions from "../components/Solutions";
// import Technology from "../components/Technology";
// import VideoInfo from "../components/videoInfo";
import Welcome from "../components/Welcome";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "url": "https://www.customwaitlist.com",
    "name": "Custom Waitlist - Free Waitlist Langding Page Builder",
    "description": "A powerful no-code tool that helps customize, publish a waitlist landing page and track signups. Perfect for founders, indie hackers and product launches.",
    "logo": "https://www.customwaitlist.com/assets/2x/icon.png"
  }
  return (
    <>
      <SEO title={"1Line"} host={"www.customwaitlist.com"} description={""} image={"https://www.customwaitlist.com/assets/2x/asset3.png"} jsonLd={jsonLd}/>
      {/* <Nav/> */}
      <Welcome />
      {/* <VideoInfo/> */}
      {/* <Solutions />    */}
      {/* <Technology /> */}
      {/* <Footer/> */}
    </>
  )
}
