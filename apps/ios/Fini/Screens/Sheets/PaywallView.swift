import SwiftUI

struct PaywallView: View {
    @EnvironmentObject var state: AppState
    @State private var selectedPlan = "pro"

    let features: [(String, String, Bool)] = [
        ("sparkle", "AI ייעוץ פיננסי בזמן אמת", true),
        ("target",  "יעדי חיסכון ומעקב",       true),
        ("trend",   "תחזיות וניתוח חכם",        true),
        ("users",   "ניהול זוגי ושיתוף",         true),
        ("lock",    "ייצוא ל-Excel ו-PDF",      false),
    ]

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color.finiRose, Color.finiCream, Color.white],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()

            VStack(spacing: 0) {
                // Top bar
                HStack {
                    Button { state.showPaywall = false } label: {
                        FiniIcon(name: "close", size: 20, color: .finiInkSoft)
                            .padding(10)
                            .background(Color.white.opacity(0.5))
                            .cornerRadius(12)
                    }
                    Spacer()
                    Button {} label: {
                        Text("שחזר רכישה")
                            .font(.rubik(13))
                            .foregroundColor(.finiInkMute)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 16)
                .padding(.bottom, 16)

                // Mascot + PRO badge
                ZStack(alignment: .topLeading) {
                    FiniMascot(size: 120, mood: .wave)
                    // Rotated PRO badge
                    Text("PRO")
                        .font(.rubik(11, weight: .black))
                        .foregroundColor(.white)
                        .padding(.horizontal, 8).padding(.vertical, 4)
                        .background(
                            LinearGradient(
                                colors: [Color.finiGold, Color(hex: "#B8872A")],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .cornerRadius(8)
                        .rotationEffect(.degrees(-15))
                        .offset(x: -8, y: 10)
                }
                .padding(.bottom, 16)

                // Title + subtitle
                VStack(spacing: 8) {
                    Text("שדרגי לפיני Pro")
                        .font(.rubik(28, weight: .bold))
                        .foregroundColor(.finiInk)
                    Text("ייעוץ AI אמיתי שיגרום לכסף שלך לעבוד קשה יותר")
                        .font(.rubik(15))
                        .foregroundColor(.finiInkSoft)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 30)
                }
                .padding(.bottom, 20)

                // Features card
                VStack(spacing: 0) {
                    ForEach(Array(features.enumerated()), id: \.0) { i, feature in
                        HStack(spacing: 12) {
                            if feature.2 {
                                ZStack {
                                    Circle().fill(Color.finiIncomeTint).frame(width: 28, height: 28)
                                    FiniIcon(name: "check", size: 14, color: .finiIncome)
                                }
                            } else {
                                ZStack {
                                    Circle().fill(Color.finiCreamDark).frame(width: 28, height: 28)
                                    FiniIcon(name: "lock", size: 14, color: .finiInkMute)
                                }
                            }
                            Text(feature.1)
                                .font(.rubik(14, weight: feature.2 ? .medium : .regular))
                                .foregroundColor(feature.2 ? .finiInk : .finiInkMute)
                            Spacer()
                        }
                        .padding(.horizontal, 16).padding(.vertical, 12)
                        if i < features.count - 1 {
                            Divider().padding(.horizontal, 16)
                        }
                    }
                }
                .background(Color.white)
                .cornerRadius(20)
                .shadow(color: Color.finiInk.opacity(0.05), radius: 8, y: 4)
                .padding(.horizontal, 16)
                .padding(.bottom, 16)

                // Plan cards side by side
                HStack(spacing: 10) {
                    // Pro
                    Button { selectedPlan = "pro" } label: {
                        VStack(spacing: 4) {
                            Text("Pro")
                                .font(.rubik(18, weight: .bold))
                                .foregroundColor(.finiInk)
                            HStack(alignment: .firstTextBaseline, spacing: 2) {
                                Text("₪29")
                                    .font(.rubik(22, weight: .bold))
                                    .foregroundColor(.finiPink)
                                Text("/חודש")
                                    .font(.rubik(11))
                                    .foregroundColor(.finiInkMute)
                            }
                            Text("7 ימי ניסיון חינם")
                                .font(.rubik(11))
                                .foregroundColor(.finiInkMute)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color.white)
                        .cornerRadius(16)
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(selectedPlan == "pro" ? Color.finiPink : Color.finiLine,
                                        lineWidth: selectedPlan == "pro" ? 2 : 1)
                        )
                        .shadow(color: selectedPlan == "pro" ? Color.finiPink.opacity(0.2) : Color.clear,
                                radius: 8, y: 3)
                    }

                    // Annual
                    Button { selectedPlan = "annual" } label: {
                        VStack(spacing: 4) {
                            Text("שנתי")
                                .font(.rubik(18, weight: .bold))
                                .foregroundColor(.finiInk)
                            HStack(alignment: .firstTextBaseline, spacing: 2) {
                                Text("₪199")
                                    .font(.rubik(22, weight: .bold))
                                    .foregroundColor(.finiPink)
                                Text("/שנה")
                                    .font(.rubik(11))
                                    .foregroundColor(.finiInkMute)
                            }
                            Text("שחסכון של 43%")
                                .font(.rubik(11, weight: .semibold))
                                .foregroundColor(.finiGreen)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color.white)
                        .cornerRadius(16)
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(selectedPlan == "annual" ? Color.finiPink : Color.finiLine,
                                        lineWidth: selectedPlan == "annual" ? 2 : 1)
                        )
                        .shadow(color: selectedPlan == "annual" ? Color.finiPink.opacity(0.2) : Color.clear,
                                radius: 8, y: 3)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 14)

                // CTA
                Button { state.showPaywall = false } label: {
                    HStack(spacing: 8) {
                        FiniIcon(name: "sparkle", size: 20, color: .white)
                        Text("להתחיל 7 ימי ניסיון חינם")
                            .font(.rubik(17, weight: .semibold))
                            .foregroundColor(.white)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 17)
                    .background(Color.finiInk)
                    .cornerRadius(18)
                    .shadow(color: Color.finiInk.opacity(0.2), radius: 10, y: 5)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 10)

                Text("ביטול בכל עת לפני תום תקופת הניסיון")
                    .font(.rubik(12))
                    .foregroundColor(.finiInkMute)
                    .padding(.bottom, 32)
            }
        }
    }
}
