// components/GoogleLoginButton.tsx
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function GoogleLoginButton() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleCredentialResponse = async (response: any) => {
  try {
    const token = response.credential;

    // Send to your backend for verification & storage
    const res = await fetch("/api/custom-google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) throw new Error("Server error");
    const data = await res.json();
    const authToken = data.token;
    // Store token in localStorage for consistency with other auth methods
    localStorage.setItem("authToken", authToken);
    document.cookie = `authToken=${authToken}; path=/;`;
    toast.success("Successfully logged in!");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (_error) {
    toast.error("Login failed. Try again.");
  }
};

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      // @ts-ignore
      google.accounts.id.renderButton(document.getElementById("googleBtn"), {
        theme: "outline",
        size: "large",
      });
    };
    document.body.appendChild(script);
  }, []);

  return <div id="googleBtn"></div>;
}
