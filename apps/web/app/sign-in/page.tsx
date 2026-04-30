import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #FDDDE8 0%, #FFF4F8 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        direction: "rtl",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #C85A8A, #E8A0C0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
            boxShadow: "0 8px 24px rgba(200,90,138,0.3)",
            fontSize: 28,
          }}
        >
          🐱
        </div>
        <h1
          style={{
            fontFamily: "'Rubik', system-ui, sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#1F1A15",
            margin: 0,
          }}
        >
          פיני
        </h1>
        <p
          style={{
            fontFamily: "'Rubik', system-ui, sans-serif",
            fontSize: 14,
            color: "#8A8070",
            margin: "4px 0 0",
          }}
        >
          שאל את הכסף שלך כמו חבר
        </p>
      </div>

      <SignIn
        routing="hash"
        afterSignInUrl="/"
        afterSignUpUrl="/"
      />
    </div>
  );
}
