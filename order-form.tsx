"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, CreditCard, MapPin, User } from "lucide-react"

type FormErrors = {
  [key: string]: string
}

export default function OrderForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Contact Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Shipping Information
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",

    // Payment Information
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [orderCompleted, setOrderCompleted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    // Validate Contact Information
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"

    // Validate Shipping Information
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state.trim()) newErrors.state = "State is required"
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"

    // Validate Payment Information
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required"
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Card number must be 16 digits"
    }

    if (!formData.cardName.trim()) newErrors.cardName = "Name on card is required"

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required"
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Use format MM/YY"
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = "CVV is required"
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        setOrderCompleted(true)
      }, 1500)
    } else {
      // Scroll to the first error
      const firstErrorField = document.querySelector('[aria-invalid="true"]')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }

  if (orderCompleted) {
    return (
      <div className="max-w-3xl mx-auto my-12 px-4">
        <div className="text-center p-8 border rounded-lg bg-background shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Completed!</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Thank you for your order. We've received your payment and will process your order shortly. You will receive
            a confirmation email with your order details.
          </p>
          <div className="mb-8 p-6 bg-muted rounded-lg max-w-sm mx-auto">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Order Number:</span>
              <span className="font-medium">ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <Button onClick={() => router.push("/")} className="min-w-[200px]">
            Return to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Order</h1>

      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Information */}
          <section className="border rounded-lg p-6 bg-background shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Contact Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.firstName ? "border-red-500" : "border-input"
                  }`}
                  aria-invalid={errors.firstName ? "true" : "false"}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                />
                {errors.firstName && (
                  <div id="firstName-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.firstName}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.lastName ? "border-red-500" : "border-input"
                  }`}
                  aria-invalid={errors.lastName ? "true" : "false"}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                />
                {errors.lastName && (
                  <div id="lastName-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.lastName}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.email ? "border-red-500" : "border-input"
                  }`}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <div id="email-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.phone ? "border-red-500" : "border-input"
                  }`}
                  aria-invalid={errors.phone ? "true" : "false"}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <div id="phone-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Shipping Information */}
          <section className="border rounded-lg p-6 bg-background shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Shipping Address</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.address ? "border-red-500" : "border-input"
                  }`}
                  aria-invalid={errors.address ? "true" : "false"}
                  aria-describedby={errors.address ? "address-error" : undefined}
                />
                {errors.address && (
                  <div id="address-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.address}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.city ? "border-red-500" : "border-input"
                    }`}
                    aria-invalid={errors.city ? "true" : "false"}
                    aria-describedby={errors.city ? "city-error" : undefined}
                  />
                  {errors.city && (
                    <div id="city-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.city}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.state ? "border-red-500" : "border-input"
                    }`}
                    aria-invalid={errors.state ? "true" : "false"}
                    aria-describedby={errors.state ? "state-error" : undefined}
                  />
                  {errors.state && (
                    <div id="state-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.state}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.zipCode ? "border-red-500" : "border-input"
                    }`}
                    aria-invalid={errors.zipCode ? "true" : "false"}
                    aria-describedby={errors.zipCode ? "zipCode-error" : undefined}
                  />
                  {errors.zipCode && (
                    <div id="zipCode-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.zipCode}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>
          </section>

          {/* Payment Information */}
          <section className="border rounded-lg p-6 bg-background shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Payment Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                  Card Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.cardNumber ? "border-red-500" : "border-input"
                  }`}
                  aria-invalid={errors.cardNumber ? "true" : "false"}
                  aria-describedby={errors.cardNumber ? "cardNumber-error" : undefined}
                />
                {errors.cardNumber && (
                  <div id="cardNumber-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.cardNumber}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="cardName" className="block text-sm font-medium mb-1">
                  Name on Card <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.cardName ? "border-red-500" : "border-input"
                  }`}
                  aria-invalid={errors.cardName ? "true" : "false"}
                  aria-describedby={errors.cardName ? "cardName-error" : undefined}
                />
                {errors.cardName && (
                  <div id="cardName-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.cardName}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.expiryDate ? "border-red-500" : "border-input"
                    }`}
                    aria-invalid={errors.expiryDate ? "true" : "false"}
                    aria-describedby={errors.expiryDate ? "expiryDate-error" : undefined}
                  />
                  {errors.expiryDate && (
                    <div id="expiryDate-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.expiryDate}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium mb-1">
                    CVV <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.cvv ? "border-red-500" : "border-input"
                    }`}
                    aria-invalid={errors.cvv ? "true" : "false"}
                    aria-describedby={errors.cvv ? "cvv-error" : undefined}
                  />
                  {errors.cvv && (
                    <div id="cvv-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.cvv}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div>
          <div className="border rounded-lg p-6 bg-background shadow-sm sticky top-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded flex-shrink-0"></div>
                  <div>
                    <p className="font-medium">Product Name</p>
                    <p className="text-sm text-muted-foreground">Qty: 1</p>
                  </div>
                </div>
                <span>$49.99</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded flex-shrink-0"></div>
                  <div>
                    <p className="font-medium">Another Product</p>
                    <p className="text-sm text-muted-foreground">Qty: 2</p>
                  </div>
                </div>
                <span>$29.98</span>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>$79.97</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>$5.99</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>$6.40</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t mt-2">
                <span>Total</span>
                <span>$92.36</span>
              </div>
            </div>

            <div className="mt-8">
              <Button type="submit" className="w-full py-6 text-base" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Complete Order"}
              </Button>

              {Object.keys(errors).length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Please fix the following errors:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {Object.values(errors).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-xs text-center text-muted-foreground mt-4">
                By completing this order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
