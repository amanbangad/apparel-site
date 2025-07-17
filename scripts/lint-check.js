import { execSync } from "child_process"

try {
  console.log("Running ESLint check...\n")

  const result = execSync("npx eslint . --ext .js,.jsx,.ts,.tsx --format=stylish", {
    encoding: "utf8",
    stdio: "pipe",
  })

  console.log("✅ No ESLint errors found!")
  console.log(result)
} catch (error) {
  console.log("❌ ESLint found issues:\n")
  console.log(error.stdout)

  if (error.stderr) {
    console.log("\nErrors:")
    console.log(error.stderr)
  }

  process.exit(1)
}
