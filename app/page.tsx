"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock, CheckCircle, Shield, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { submitQuoteRequest } from "./actions"

export default function BrownfieldLanding() {
  const [currentVideo, setCurrentVideo] = useState(0)
  const videos = ["/videos/timeline.mp4"]
  const [currentCertificate, setCurrentCertificate] = useState(0)
  const certificates = [
    "/images/certificates/certificate-1.png",
    "/images/certificates/certificate-2.png",
    "/images/certificates/certificate-3.png",
    "/images/certificates/certificate-4.png",
  ]

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length)
    }, 10000) // Switch every 10 seconds

    return () => clearInterval(interval)
  }, [videos.length])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCertificate((prev) => (prev + 1) % certificates.length)
    }, 5000) // Switch every 5 seconds

    return () => clearInterval(interval)
  }, [certificates.length])

  // Add this new useEffect for video handling
  useEffect(() => {
    const video = document.querySelector("video") as HTMLVideoElement
    if (video) {
      // Force video to load and play
      video.load()

      const playVideo = async () => {
        try {
          await video.play()
          console.log("Video is playing")
        } catch (error) {
          console.error("Video play failed:", error)
          // Show fallback background
          const fallback = document.querySelector(".video-fallback") as HTMLElement
          if (fallback) {
            video.style.display = "none"
            fallback.style.display = "block"
          }
        }
      }

      // Try to play when video is ready
      if (video.readyState >= 3) {
        playVideo()
      } else {
        video.addEventListener("canplay", playVideo, { once: true })
      }

      // Cleanup
      return () => {
        video.removeEventListener("canplay", playVideo)
      }
    }
  }, [])

  useEffect(() => {
    // Enable smooth scrolling and add padding for fixed header
    document.documentElement.style.scrollBehavior = "smooth"
    document.documentElement.style.scrollPaddingTop = "144px" // Add padding to account for fixed header plus extra space

    return () => {
      // Cleanup
      document.documentElement.style.scrollBehavior = "auto"
      document.documentElement.style.scrollPaddingTop = "0"
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.service ||
      !formData.message
    ) {
      setSubmitMessage("Please fill in all fields.")
      setSubmitSuccess(false)
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setSubmitMessage("Please enter a valid email address.")
      setSubmitSuccess(false)
      setIsSubmitting(false)
      return
    }

    try {
      const result = await submitQuoteRequest(formData)

      if (result.success) {
        setSubmitMessage(
          "Thank you! Your quote request has been submitted successfully. We've sent a confirmation to your email and our sales team will contact you within 24 hours.",
        )
        setSubmitSuccess(true)
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        })
      } else {
        setSubmitMessage(result.message)
        setSubmitSuccess(false)
      }
    } catch (error) {
      setSubmitMessage(
        "We're having trouble submitting your request. Please try again or contact us directly at +971 5 655877.",
      )
      setSubmitSuccess(false)
    }

    setIsSubmitting(false)
  }

  const content = {
    nav: {
      aboutUs: "About Us",
      theTeam: "The Team",
      services: "Our Services",
      portfolio: "Portfolio",
      contactUs: "Contact Us",
      getQuote: "Get Quote",
    },
    hero: {
      title: "Your Partner for Property Maintenance & Management",
      description:
        "Since 2016, Brownfield has successfully delivered a wide range of property management and general maintenance projects across the UAE — from major refurbishments and system installations to routine repairs and emergency fixes. We serve both residential and commercial properties with quality work, fair pricing, and guaranteed satisfaction",
      callNow: "Call or Chat: +971 5 655877",
      requestQuote: "Request Free Quote",
    },
    aboutUs: {
      title: "About Us",
      mission: {
        title: "Our Mission",
        description:
          "To provide exceptional property maintenance and management services that exceed our clients' expectations while building long-term partnerships based on trust, reliability, and superior craftsmanship.",
        icon: "/images/about/mission.png",
      },
      vision: {
        title: "Our Vision",
        description:
          "To be the leading property maintenance and management company in the UAE, recognized for our innovation, quality, and commitment to sustainable practices that enhance property value and client satisfaction.",
        icon: "/images/about/vision.png",
      },
      values: {
        title: "Our Values",
        description:
          "We are committed to integrity, excellence, and transparency in all our operations. Our core values drive us to deliver quality workmanship, maintain honest communication, and build lasting relationships with our clients.",
        icon: "/images/about/values.png",
      },
    },
    whyChoose: {
      title: "Why Choose Brownfield?",
      description:
        "With over 10 years of experience in the building maintenance & property management market, we've built our reputation on quality work, honest pricing, and exceptional customer service.",
      features: [
        {
          title: "Licensed & Insured",
          description: "Fully licensed and insured for your peace of mind",
        },
        {
          title: "Reliable Service",
          description: "On-time service and transparent communication",
        },
        {
          title: "Quality Workmanship",
          description: "Professional results that last",
        },
        {
          title: "Satisfaction Guaranteed",
          description: "We stand behind our work 100%",
        },
      ],
    },
    services: {
      title: "Our Services",
      subtitle:
        "Turnkey solutions for property management, maintenance, and cleaning — delivered with reliability and attention to detail.",
      residential: {
        title: "Properties Management",
        description: "Professional property management maximizing returns through care, efficiency, and value.",
        items: [
          "Property Marketing & Listings",
          "Leasing & Contract Administration",
          "Facility Management & Upkeep",
          "Valuation & Advisory Services",
        ],
      },
      commercial: {
        title: "Fit-out & Space Renovation",
        description: "Professional renovation and fit-out services for commercial and residential spaces.",
        items: ["Office and retail fit-outs", "Interior renovations", "Space optimization", "Custom design solutions"],
      },
      emergency: {
        title: "General Maintenance",
        description: "Comprehensive maintenance services for all types of properties.",
        items: [
          "Air-conditioning & Ventilation Repairs",
          "Electrical & Lighting Repairs",
          "Plumbing & Sanitary Repairs",
          "Painting, Carpentry & Joinery Repairs",
        ],
      },
      cleaning: {
        title: "Cleaning & Housekeeping",
        description: "Professional cleaning services for residential and commercial properties.",
        items: [
          "Regular cleaning services",
          "Deep cleaning & sanitization",
          "Post-construction cleaning",
          "Specialized Surface Treatments (Marble, Wood Tiles, Porcelain, etc)",
        ],
      },
    },
    cta: {
      title: "Ready to Get Started?",
      description: "Contact us today for a free estimate. We're here to help with all your maintenance needs.",
      call: "Call (555) 123-4567",
      requestQuote: "Request Free Quote",
    },
    contact: {
      title: "Get In Touch",
      description:
        "Ready to discuss with us your property maintenance and management needs? Contact us today for a free consultation and estimate.",
      address: "Address",
      email: "Email",
      phone: "Phone",
      hours: "Hours",
      addressText: "Greater Metro Area & Surrounding Communities",
      hoursText: "Mon-Fri: 7AM-6PM | Emergency: 24/7",
      form: {
        title: "Request a Free Quote",
        description: "Fill out the form below and we'll get back to you within 24 hours.",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        phone: "Phone",
        service: "Service Needed",
        servicePlaceholder: "e.g., Plumbing repair, HVAC maintenance",
        message: "Message",
        messagePlaceholder: "Please describe your maintenance needs...",
        send: "Send Message",
      },
    },
    footer: {
      copyright: "Brownfield General Maintenance & Properties Management LLC. All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      license: "License Info",
    },
    team: {
      title: "Meet Our Team",
      subtitle:
        "The leadership at Brownfield combines diverse skills and focused effort to bring strategic goals to life.",
      members: [
        {
          name: "Saiful Islam",
          role: "Managing Partner & General Manager",
          description:
            "Saiful Islam began his journey with humble roots as a maintenance technician. His unwavering entrepreneurial spirit and dedication to excellence have been key to Brownfield's growth into a trusted contracting partner for prominent clients across both private and government sectors.",
          image: "/images/saiful-updated.png",
        },
        {
          name: "Mohammed Ebrahim",
          role: "Managing Partner – Business Development",
          description:
            "Mohammed Ebrahim is a dynamic business development leader and experienced Mechanical Engineer with over 15 years of combined technical and commercial expertise. He has contributed to the successful delivery of key projects at LG Electronics Abu Dhabi, Six Sigma Middle East Constructions, and Al Benaa Al Shamel FM. At Brownfield, he spearheads growth by forging strategic partnerships, identifying high-value opportunities, and aligning client needs with tailored, results-driven solutions.",
          image: "/images/ebrahim-updated.png",
        },
        {
          name: "Sheikh Saeedi",
          role: "Managing Partner – Projects",
          description:
            "Sheikh Saeedi is a highly accomplished civil and construction management professional with deep expertise in infrastructure, public utilities, and high-end development projects. He has successfully delivered a wide range of complex works, including numerous fit-out projects during his tenure with interior design and contracting firm United Design International in Abu Dhabi. His portfolio includes healthcare facilities, educational institutions, and landmark collaborations with Abu Dhabi and Al Ain Municipalities, as well as prestigious clients such as Aldar and the Presidential Court. Sheikh Saeedi brings strategic oversight, technical excellence, and proven leadership to every project he undertakes.",
          image: "/images/sheikh-updated.png",
        },
        {
          name: "Suresh Kumar",
          role: "Head of Operations",
          description:
            "Suresh Kumar is a seasoned engineer with over 15 years of experience in the UAE's construction and facilities management sector. As Head of Operations at Brownfield, he leads the MEP division with a sharp focus on renovation, retrofitting, and fit-out works. His strong technical acumen and operational leadership have been instrumental in consistently delivering projects on time, within budget, and to the highest quality standards. Suresh's unwavering commitment to excellence has played a key role in strengthening Brownfield's reputation as a trusted name in the UAE market.",
          image: "/images/suresh-updated.png",
        },
      ],
    },
    portfolio: {
      title: "Our Portfolio",
      subtitle: "Explore some of our completed projects",
      projects: [
        {
          image: "/images/portfolio/adgm.png",
          title: "ADGM Project",
          details: {
            endUser: "Abu Dhabi Global Market",
            scope: "MEP & Civil Fit-out Works",
            location: "ADGM Building - Abu Dhabi",
            year: "2023",
          },
        },
        {
          image: "/images/portfolio/moccae.png",
          title: "MOCCAE Project",
          details: {
            endUser: "Ministry of Climate Change",
            scope: "MEP & Civil Renovation Works",
            location: "MOCCAE Building - Dubai",
            year: "2023 & 2024",
          },
        },
        {
          image: "/images/portfolio/ainmosque.png",
          title: "Al Ain Mosque",
          details: {
            endUser: "AWQAF",
            scope: "Lighting Renovation Works",
            location: "Al Ain Central Mosque - Al Ain",
            year: "2021",
          },
        },
        {
          image: "/images/portfolio/alain.png",
          title: "Al Ain Tower",
          details: {
            endUser: "Al Ain Holding",
            scope: "Civil & MEP Maintenance Works",
            location: "Al Ain Tower - Al Ain",
            year: "2019",
          },
        },
        {
          image: "/images/portfolio/aldar.png",
          title: "Aldar HQ",
          details: {
            endUser: "Aldar Properties PJSC",
            scope: "Replacing Existing Lights with LED",
            location: "Aldar HQ Building - Abu Dhabi",
            year: "2022",
          },
        },
        {
          image: "/images/portfolio/unitedsquare.png",
          title: "United Square",
          details: {
            endUser: "ICT",
            scope: "Civil & MEP Maintenance Works",
            location: "United Square Tower – Abu Dhabi",
            year: "2020",
          },
        },
      ],
    },
  }

  const nextCertificate = () => {
    setCurrentCertificate((prev) => (prev + 1) % certificates.length)
  }

  const prevCertificate = () => {
    setCurrentCertificate((prev) => (prev - 1 + certificates.length) % certificates.length)
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <header className="px-4 md:px-6 lg:px-10 h-20 md:h-32 flex items-center sticky top-0 z-50 bg-gradient-to-r from-white via-gray-500 to-black w-full">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/images/brownfield-new-logo.png"
            alt="Brownfield General Maintenance & Properties Management"
            width={600}
            height={400}
            className="h-16 md:h-28 w-auto"
          />
        </Link>
        <nav className="ml-auto flex items-center">
          <div className="hidden md:flex gap-4 lg:gap-6 xl:gap-8">
            <Link
              href="#about"
              className="text-sm lg:text-lg xl:text-xl font-bold text-white hover:text-gray-200 transition-colors"
            >
              {content.nav.aboutUs}
            </Link>
            <Link
              href="#team"
              className="text-sm lg:text-lg xl:text-xl font-bold text-white hover:text-gray-200 transition-colors"
            >
              {content.nav.theTeam}
            </Link>
            <Link
              href="#services"
              className="text-sm lg:text-lg xl:text-xl font-bold text-white hover:text-gray-200 transition-colors"
            >
              {content.nav.services}
            </Link>
            <Link
              href="#portfolio"
              className="text-sm lg:text-lg xl:text-xl font-bold text-white hover:text-gray-200 transition-colors"
            >
              {content.nav.portfolio}
            </Link>
            <Link
              href="#contact"
              className="text-sm lg:text-lg xl:text-xl font-bold text-white hover:text-gray-200 transition-colors"
            >
              {content.nav.contactUs}
            </Link>
          </div>
          <Button
            className="ml-4 md:ml-8 bg-gray-800 text-white hover:bg-gray-700 hover:text-white text-sm md:text-lg lg:text-xl px-3 md:px-6 py-2 transition-all duration-300"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            {content.nav.getQuote}
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden min-h-[90vh] flex items-center">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{ minHeight: "100vh" }}
            onLoadStart={() => console.log("Video loading started")}
            onCanPlay={() => console.log("Video can play")}
            onError={(e) => {
              console.error("Video error:", e)
              // Hide video and show fallback
              const video = e.target as HTMLVideoElement
              video.style.display = "none"
              const fallback = video.parentElement?.querySelector(".video-fallback") as HTMLElement
              if (fallback) {
                fallback.style.display = "block"
              }
            }}
          >
            <source src="/videos/timeline.mp4" type="video/mp4" />
            <source src="/videos/timeline.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>

          {/* Fallback Background - shows if video fails */}
          <div
            className="video-fallback absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 z-0"
            style={{ display: "none" }}
          ></div>

          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>

          {/* Content */}
          <div className="relative z-20 w-full px-4 md:px-6 lg:px-8 xl:px-12">
            <div className="flex flex-col items-center text-center max-w-6xl mx-auto space-y-6 md:space-y-8">
              {/* Logo - Responsive sizing */}
              <div className="flex justify-center">
                <Image
                  src="/images/brownfield-main-logo.png"
                  alt="Brownfield General Maintenance & Properties Management"
                  width={600}
                  height={300}
                  className="h-32 sm:h-40 md:h-60 lg:h-84 xl:h-[28rem] 2xl:h-[32rem] w-auto"
                  priority
                />
              </div>

              {/* Main Heading */}
              <div className="space-y-3 md:space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tight text-white leading-tight px-2">
                  {content.hero.title}
                </h1>
              </div>

              {/* Description */}
              <div className="max-w-4xl px-2">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 leading-relaxed">
                  {content.hero.description}
                </p>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4 w-full max-w-2xl px-2">
                <div className="relative group flex-1">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#bdbdbd] to-[#9e9e9e] hover:bg-green-500 hover:from-green-500 hover:to-green-600 text-sm md:text-lg px-4 md:px-8 py-4 md:py-6 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center">
                      <Phone className="mr-2 md:mr-3 h-4 md:h-6 w-4 md:w-6" />
                      <Image
                        src="/icons/whatsapp.png"
                        alt="WhatsApp"
                        width={20}
                        height={20}
                        className="mr-2 md:mr-3 h-4 md:h-6 w-4 md:w-6"
                      />
                      <span className="text-xs md:text-base">{content.hero.callNow}</span>
                    </div>
                  </Button>
                  <div className="absolute left-0 mt-2 w-full bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="p-3 md:p-4 space-y-2">
                      <a
                        href="tel:+97156655877"
                        className="flex items-center gap-2 md:gap-3 p-2 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <Phone className="h-4 md:h-6 w-4 md:w-6 text-gray-700" />
                        <span className="text-sm md:text-base text-gray-800">Call Now</span>
                      </a>
                      <a
                        href="https://wa.me/97156655877"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 md:gap-3 p-2 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <Image
                          src="/icons/whatsapp.png"
                          alt="WhatsApp"
                          width={20}
                          height={20}
                          className="h-4 md:h-6 w-4 md:w-6 brightness-0"
                        />
                        <span className="text-sm md:text-base text-gray-800">Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 border-2 border-white bg-white text-black hover:bg-gray-100 hover:border-gray-100 text-sm md:text-lg px-4 md:px-8 py-4 md:py-6"
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {content.hero.requestQuote}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="w-full py-16 md:py-24 lg:py-32 bg-gray-50">
          <div className="w-full max-w-none px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">{content.aboutUs.title}</h2>
            </div>
            <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
              {/* Mission */}
              <Card className="text-center shadow-lg">
                <CardContent className="pt-8 px-8 pb-8">
                  <div className="flex flex-col items-center space-y-6">
                    <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full">
                      <Image
                        src={content.aboutUs.mission.icon || "/placeholder.svg"}
                        alt="Our Mission"
                        width={72}
                        height={72}
                        className="w-18 h-18"
                      />
                    </div>
                    <h3 className="text-2xl font-bold">{content.aboutUs.mission.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{content.aboutUs.mission.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Vision */}
              <Card className="text-center shadow-lg">
                <CardContent className="pt-8 px-8 pb-8">
                  <div className="flex flex-col items-center space-y-6">
                    <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full">
                      <Image
                        src={content.aboutUs.vision.icon || "/placeholder.svg"}
                        alt="Our Vision"
                        width={72}
                        height={72}
                        className="w-18 h-18"
                      />
                    </div>
                    <h3 className="text-2xl font-bold">{content.aboutUs.vision.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{content.aboutUs.vision.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Values */}
              <Card className="text-center shadow-lg">
                <CardContent className="pt-8 px-8 pb-8">
                  <div className="flex flex-col items-center space-y-6">
                    <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full">
                      <Image
                        src={content.aboutUs.values.icon || "/placeholder.svg"}
                        alt="Our Values"
                        width={72}
                        height={72}
                        className="w-18 h-18"
                      />
                    </div>
                    <h3 className="text-2xl font-bold">{content.aboutUs.values.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{content.aboutUs.values.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Section - Moved to be after About Us */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="w-full max-w-none px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    {content.whyChoose.title}
                  </h2>
                  <p className="text-gray-500 text-xl md:text-2xl">{content.whyChoose.description}</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {content.whyChoose.features.map((feature, index) => {
                    const icons = [Shield, Clock, CheckCircle, CheckCircle]
                    const Icon = icons[index]
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <Icon className="h-8 w-8 text-[#bdbdbd] mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-xl font-semibold">{feature.title}</h3>
                          <p className="text-lg text-gray-500">{feature.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-lg">
                  {/* Certificate Carousel - Blurred */}
                  <div className="overflow-hidden rounded-xl shadow-lg">
                    <div className="relative">
                      <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentCertificate * 100}%)` }}
                      >
                        {certificates.map((cert, index) => (
                          <div key={index} className="w-full flex-shrink-0">
                            <Image
                              src={cert || "/placeholder.svg"}
                              alt={`Certificate ${index + 1}`}
                              width={600}
                              height={400}
                              className="w-full h-auto object-cover blur-md"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-between p-4">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full bg-white/80 hover:bg-white"
                          onClick={prevCertificate}
                        >
                          <ChevronLeft className="h-6 w-6" />
                          <span className="sr-only">Previous</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full bg-white/80 hover:bg-white"
                          onClick={nextCertificate}
                        >
                          <ChevronRight className="h-6 w-6" />
                          <span className="sr-only">Next</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* Carousel Indicators */}
                  <div className="flex justify-center mt-4 space-x-2">
                    {certificates.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          currentCertificate === index ? "bg-gray-800" : "bg-gray-300"
                        }`}
                        onClick={() => setCurrentCertificate(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="w-full py-16 md:py-28 lg:py-36 bg-gray-50">
          <div className="w-full max-w-none px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
              <div className="space-y-3">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                  {content.services.title}
                </h2>
                <p className="w-full max-w-7xl text-gray-500 text-lg md:text-xl">{content.services.subtitle}</p>
              </div>
            </div>
            <div className="mx-auto grid max-w-[90rem] items-stretch gap-8 py-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-12">
              {/* Properties Management */}
              <div className="group relative bg-white rounded-lg shadow-lg overflow-hidden h-full">
                {/* Main Content - Always Visible */}
                <div className="p-8 text-center h-full flex flex-col">
                  <div className="overflow-hidden rounded-lg mb-8">
                    <Image
                      src="/images/abu-dhabi-skyline.jpg"
                      alt="Properties Management"
                      width={600}
                      height={400}
                      className="w-full h-80 md:h-96 object-cover filter grayscale transition-all duration-500 ease-in-out transform group-hover:grayscale-0 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{content.services.residential.title}</h3>
                  <p className="text-base md:text-lg text-gray-600 mb-6">{content.services.residential.description}</p>
                </div>

                {/* Hover Overlay with Details */}
                <div className="absolute inset-0 bg-white bg-opacity-95 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                  <div className="p-8 h-full flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">{content.services.residential.title}</h3>
                      <p className="text-base md:text-lg text-gray-600 mb-6">
                        {content.services.residential.description}
                      </p>
                    </div>
                    <ul className="space-y-4 text-base overflow-y-auto">
                      {content.services.residential.items.map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-[#bdbdbd] flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Fit-out & Space Renovation */}
              <div className="group relative bg-white rounded-lg shadow-lg overflow-hidden h-full">
                {/* Main Content - Always Visible */}
                <div className="p-8 text-center h-full flex flex-col">
                  <div className="overflow-hidden rounded-lg mb-8">
                    <Image
                      src="/images/fitout-renovation.jpeg"
                      alt="Fit-out and Space Renovation"
                      width={600}
                      height={400}
                      className="w-full h-80 md:h-96 object-cover filter grayscale transition-all duration-500 ease-in-out transform group-hover:grayscale-0 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{content.services.commercial.title}</h3>
                  <p className="text-base md:text-lg text-gray-600 mb-6">{content.services.commercial.description}</p>
                </div>

                {/* Hover Overlay with Details */}
                <div className="absolute inset-0 bg-white bg-opacity-95 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                  <div className="p-8 h-full flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">{content.services.commercial.title}</h3>
                      <p className="text-base md:text-lg text-gray-600 mb-6">
                        {content.services.commercial.description}
                      </p>
                    </div>
                    <ul className="space-y-4 text-base overflow-y-auto">
                      {content.services.commercial.items.map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-[#bdbdbd] flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* General Maintenance */}
              <div className="group relative bg-white rounded-lg shadow-lg overflow-hidden h-full">
                {/* Main Content - Always Visible */}
                <div className="p-8 text-center h-full flex flex-col">
                  <div className="overflow-hidden rounded-lg mb-8">
                    <Image
                      src="/images/general-maintenance.png"
                      alt="General Maintenance"
                      width={600}
                      height={400}
                      className="w-full h-80 md:h-96 object-cover filter grayscale transition-all duration-500 ease-in-out transform group-hover:grayscale-0 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{content.services.emergency.title}</h3>
                  <p className="text-base md:text-lg text-gray-600 mb-6">{content.services.emergency.description}</p>
                </div>

                {/* Hover Overlay with Details */}
                <div className="absolute inset-0 bg-white bg-opacity-95 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                  <div className="p-8 h-full flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">{content.services.emergency.title}</h3>
                      <p className="text-base md:text-lg text-gray-600 mb-6">
                        {content.services.emergency.description}
                      </p>
                    </div>
                    <ul className="space-y-4 text-base overflow-y-auto">
                      {content.services.emergency.items.map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-[#bdbdbd] flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cleaning & Housekeeping */}
              <div className="group relative bg-white rounded-lg shadow-lg overflow-hidden h-full">
                {/* Main Content - Always Visible */}
                <div className="p-8 text-center h-full flex flex-col">
                  <div className="overflow-hidden rounded-lg mb-8">
                    <Image
                      src="/images/cleaning-housekeeping.png"
                      alt="Cleaning & Housekeeping"
                      width={600}
                      height={400}
                      className="w-full h-80 md:h-96 object-cover filter grayscale transition-all duration-500 ease-in-out transform group-hover:grayscale-0 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{content.services.cleaning.title}</h3>
                  <p className="text-base md:text-lg text-gray-600 mb-6">{content.services.cleaning.description}</p>
                </div>

                {/* Hover Overlay with Details */}
                <div className="absolute inset-0 bg-white bg-opacity-95 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                  <div className="p-8 h-full flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">{content.services.cleaning.title}</h3>
                      <p className="text-base md:text-lg text-gray-600 mb-6">{content.services.cleaning.description}</p>
                    </div>
                    <ul className="space-y-4 text-base overflow-y-auto">
                      {content.services.cleaning.items.map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-[#bdbdbd] flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="w-full max-w-none px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">{content.team.title}</h2>
                <p className="max-w-[900px] text-gray-500 text-lg md:text-xl">{content.team.subtitle}</p>
              </div>
            </div>
            <div className="mx-auto grid max-w-[90rem] items-stretch gap-8 py-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-12">
              {content.team.members.map((member, index) => (
                <div key={index} className="group relative bg-white rounded-lg shadow-lg overflow-hidden h-full">
                  {/* Main Content - Always Visible */}
                  <div className="p-8 text-center h-full flex flex-col">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="rounded-full object-cover w-48 h-48 mx-auto mb-6 flex-shrink-0"
                    />
                    <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                    <p className="text-lg font-medium text-[#bdbdbd] mb-4">{member.role}</p>
                  </div>

                  {/* Hover Overlay with Description */}
                  <div className="absolute inset-0 bg-white bg-opacity-95 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                    <div className="p-8 h-full flex flex-col justify-center">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                        <p className="text-lg font-medium text-[#bdbdbd]">{member.role}</p>
                      </div>
                      <p className="text-base text-gray-600 leading-relaxed text-justify overflow-y-auto">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="w-full max-w-none px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                  {content.portfolio.title}
                </h2>
                <p className="max-w-[900px] text-gray-500 text-lg md:text-xl">{content.portfolio.subtitle}</p>
              </div>
            </div>
            <div className="mx-auto grid max-w-7xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {content.portfolio.projects.map((project, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={500}
                    height={400}
                    className="w-full h-80 object-cover filter grayscale transition-all duration-500 ease-in-out group-hover:grayscale-0"
                  />
                  {/* Hover Overlay - Positioned higher */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center">
                    <div className="w-full bg-black bg-opacity-50 text-white p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 absolute bottom-8">
                      <div className="text-sm space-y-2">
                        <div>▪ End User: {project.details.endUser}</div>
                        <div>▪ Scope of Works: {project.details.scope}</div>
                        <div>▪ Location: {project.details.location}</div>
                        <div>▪ Year Completed: {project.details.year}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#757575] to-[#616161]">
          <div className="w-full max-w-none px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  {content.cta.title}
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-100 text-lg md:text-xl">
                  Get in touch for a free quote. From routine maintenance to full property management, we've got you
                  covered.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="relative group">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#bdbdbd] to-[#9e9e9e] hover:bg-green-500 hover:from-green-500 hover:to-green-600 text-lg px-8 py-6 transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <Phone className="mr-3 h-6 w-6" />
                      <Image src="/icons/whatsapp.png" alt="WhatsApp" width={24} height={24} className="mr-3 h-6 w-6" />
                      <span>{content.hero.callNow}</span>
                    </div>
                  </Button>
                  <div className="absolute left-0 mt-2 w-full bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="p-4 space-y-2">
                      <a
                        href="tel:+97156655877"
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <Phone className="h-6 w-6 text-gray-700" />
                        <span className="text-gray-800">Call Now</span>
                      </a>
                      <a
                        href="https://wa.me/97156655877"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <Image
                          src="/icons/whatsapp.png"
                          alt="WhatsApp"
                          width={24}
                          height={24}
                          className="h-6 w-6 brightness-0"
                        />
                        <span className="text-gray-800">Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white bg-white text-black hover:bg-gray-100 hover:border-gray-100 text-lg px-8 py-6"
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {content.hero.requestQuote}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="w-full max-w-none px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{content.contact.title}</h2>
                <p className="text-gray-500 text-lg md:text-xl">{content.contact.description}</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-[#bdbdbd] flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-xl">{content.contact.address}</p>
                      <p className="text-gray-500 text-xl">Office 103, Al Ain Tower, Hamdan St, Abu Dhabi</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-[#bdbdbd] flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-xl">{content.contact.email}</p>
                      <p className="text-gray-500 text-xl">info@brownfield.ae</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[#bdbdbd] flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-xl">{content.contact.phone}</p>
                      <p className="text-gray-500 text-xl">+971 5 655877</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#bdbdbd] flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-xl">{content.contact.hours}</p>
                      <p className="text-gray-500 text-xl">Mon-Fri: 8AM-5PM | Emergency: 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold">{content.contact.form.title}</CardTitle>
                  <CardDescription className="text-xl">{content.contact.form.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <label htmlFor="firstName" className="text-lg font-medium">
                          {content.contact.form.firstName}
                        </label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="text-lg py-3"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="lastName" className="text-lg font-medium">
                          {content.contact.form.lastName}
                        </label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="text-lg py-3"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="email" className="text-lg font-medium">
                        {content.contact.form.email}
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="text-lg py-3"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="phone" className="text-lg font-medium">
                        {content.contact.form.phone}
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="text-lg py-3"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="service" className="text-lg font-medium">
                        {content.contact.form.service}
                      </label>
                      <Input
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="text-lg py-3"
                        placeholder={content.contact.form.servicePlaceholder}
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="message" className="text-lg font-medium">
                        {content.contact.form.message}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder={content.contact.form.messagePlaceholder}
                        className="min-h-[120px] w-full rounded-md border border-input bg-background px-4 py-3 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>

                    {/* Submit Message */}
                    {submitMessage && (
                      <div
                        className={`p-4 rounded-md ${submitSuccess ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}
                      >
                        {submitMessage}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#bdbdbd] to-[#9e9e9e] hover:from-green-500 hover:to-green-600 text-xl py-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : content.contact.form.send}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-50">
        <div className="flex items-center gap-2">
          <Image
            src="/brownfield-logo.png"
            alt="Brownfield General Maintenance & Properties Management"
            width={120}
            height={80}
            className="h-10 w-auto"
          />
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {content.footer.copyright}
          </p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-500">
            {content.footer.privacy}
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-500">
            {content.footer.terms}
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-500">
            {content.footer.license}
          </Link>
        </nav>
      </footer>
    </div>
  )
}
