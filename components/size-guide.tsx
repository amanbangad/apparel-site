"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Ruler } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function SizeGuide() {
  const [unit, setUnit] = useState<"inches" | "cm">("inches")

  const sizeData = {
    inches: {
      XS: { chest: "32-34", waist: "26-28", hips: "34-36" },
      S: { chest: "35-37", waist: "29-31", hips: "37-39" },
      M: { chest: "38-40", waist: "32-34", hips: "40-42" },
      L: { chest: "41-43", waist: "35-37", hips: "43-45" },
      XL: { chest: "44-46", waist: "38-40", hips: "46-48" },
    },
    cm: {
      XS: { chest: "81-86", waist: "66-71", hips: "86-91" },
      S: { chest: "89-94", waist: "74-79", hips: "94-99" },
      M: { chest: "97-102", waist: "81-86", hips: "102-107" },
      L: { chest: "104-109", waist: "89-94", hips: "109-114" },
      XL: { chest: "112-117", waist: "97-102", hips: "117-122" },
    },
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto font-normal text-sm">
          <Ruler className="h-4 w-4 mr-1" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">Find your perfect fit</p>
            <div className="flex items-center space-x-2">
              <Button variant={unit === "inches" ? "default" : "outline"} size="sm" onClick={() => setUnit("inches")}>
                Inches
              </Button>
              <Button variant={unit === "cm" ? "default" : "outline"} size="sm" onClick={() => setUnit("cm")}>
                Centimeters
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border px-4 py-2 text-left">Size</th>
                  <th className="border px-4 py-2 text-left">Chest</th>
                  <th className="border px-4 py-2 text-left">Waist</th>
                  <th className="border px-4 py-2 text-left">Hips</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(sizeData[unit]).map(([size, measurements]) => (
                  <tr key={size}>
                    <td className="border px-4 py-2 font-medium">{size}</td>
                    <td className="border px-4 py-2">
                      {measurements.chest} {unit}
                    </td>
                    <td className="border px-4 py-2">
                      {measurements.waist} {unit}
                    </td>
                    <td className="border px-4 py-2">
                      {measurements.hips} {unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="font-medium">How to Measure</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium mb-1">Chest</p>
                <p className="text-muted-foreground">
                  Measure around the fullest part of your chest, keeping the tape horizontal.
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Waist</p>
                <p className="text-muted-foreground">
                  Measure around your natural waistline, keeping the tape comfortably loose.
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Hips</p>
                <p className="text-muted-foreground">
                  Measure around the fullest part of your hips, keeping the tape horizontal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
