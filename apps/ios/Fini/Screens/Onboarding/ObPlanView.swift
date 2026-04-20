import SwiftUI

struct ObPlanView: View {
    let onNext: () -> Void
    let onBack: () -> Void
    @State private var selectedPlan: String = "pro"

    var body: some View {
        ZStack {
            Color.finiRose.ignoresSafeArea()
            RadialGradient(
                colors: [Color(hex: "#FFE6B8"), Color.finiRose.opacity(0)],
                center: .center, startRadius: 0, endRadius: 200
            )
            .frame(width: 360, height: 360)
            .offset(x: 80, y: -180)
            .allowsHitTesting(false)

            VStack(spacing: 0) {
                FiniStatusBar()

                // Nav bar
                HStack {
                    Button(action: onBack) {
                        HStack(spacing: 6) {
                            FiniIcon(name: "arrow", size: 18, color: .finiInkSoft)
                            Text("חזרה")
                                .font(.rubik(15))
                                .foregroundColor(.finiInkSoft)
                        }
                        .padding(.horizontal, 14).padding(.vertical, 8)
                        .background(Color.white.opacity(0.7))
                        .cornerRadius(20)
                    }
                    Spacer()
                    Text("5/5")
                        .font(.rubik(13, weight: .medium))
                        .foregroundColor(.finiInkMute)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 16)

                ProgressDots(total: 5, current: 4)
                    .padding(.bottom, 20)

                // Header
                VStack(spacing: 6) {
                    FiniAvatar(size: 52, mood: .happy)
                    Text("בחרי את התוכנית שלך")
                        .font(.rubik(24, weight: .bold))
                        .foregroundColor(.finiInk)
                    Text("7 ימי ניסיון חינם, ביטול בכל עת")
                        .font(.rubik(14))
                        .foregroundColor(.finiInkMute)
                }
                .padding(.bottom, 20)

                // Plan cards
                HStack(spacing: 10) {
                    // Free plan
                    PlanCard(
                        title: "Free",
                        price: "חינם",
                        priceNote: "לתמיד",
                        features: ["₪ מעקב הוצאות בסיסי", "📊 תובנות בסיסיות", "📅 יומן פיננסי"],
                        lockedFeatures: ["🤖 AI ייעוץ", "👫 ניהול זוגי"],
                        isSelected: selectedPlan == "free",
                        accentColor: .finiInkSoft,
                        badge: nil
                    ) { selectedPlan = "free" }

                    // Pro plan (selected)
                    PlanCard(
                        title: "Pro",
                        price: "₪29",
                        priceNote: "לחודש",
                        features: ["✓ הכל מ-Free", "🤖 פיני AI מלא", "🎯 יעדי חיסכון", "📈 תחזיות חכמות"],
                        lockedFeatures: ["👫 ניהול זוגי"],
                        isSelected: selectedPlan == "pro",
                        accentColor: .finiPink,
                        badge: "הכי פופולרי"
                    ) { selectedPlan = "pro" }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 10)

                // Pro+ card (full width)
                ProPlusPlanCard(
                    isSelected: selectedPlan == "proPlus"
                ) { selectedPlan = "proPlus" }
                .padding(.horizontal, 16)

                Spacer()

                // CTA
                Button(action: onNext) {
                    HStack(spacing: 8) {
                        FiniIcon(name: "sparkle", size: 20, color: .white)
                        Text(selectedPlan == "free" ? "להתחיל בחינם" : "להתחיל 7 ימי ניסיון")
                            .font(.rubik(17, weight: .semibold))
                            .foregroundColor(.white)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 17)
                    .background(
                        LinearGradient(
                            colors: [Color.finiPink, Color(hex: "#B04878")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .cornerRadius(18)
                    .shadow(color: Color.finiPink.opacity(0.35), radius: 10, y: 5)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 12)

                Text("ביטול בכל עת · תשלום אחרי 7 ימים")
                    .font(.rubik(12))
                    .foregroundColor(.finiInkMute)
                    .padding(.bottom, 36)
            }
        }
    }
}

struct PlanCard: View {
    let title: String
    let price: String
    let priceNote: String
    let features: [String]
    let lockedFeatures: [String]
    let isSelected: Bool
    let accentColor: Color
    let badge: String?
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .trailing, spacing: 0) {
                if let badge = badge {
                    Text(badge)
                        .font(.rubik(10, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 8).padding(.vertical, 4)
                        .background(accentColor)
                        .cornerRadius(8)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.bottom, 8)
                }
                Text(title)
                    .font(.rubik(20, weight: .bold))
                    .foregroundColor(.finiInk)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                HStack(alignment: .firstTextBaseline, spacing: 2) {
                    Text(priceNote)
                        .font(.rubik(11))
                        .foregroundColor(.finiInkMute)
                    Text(price)
                        .font(.rubik(26, weight: .bold))
                        .foregroundColor(.finiInk)
                }
                .frame(maxWidth: .infinity, alignment: .trailing)
                .padding(.bottom, 10)

                Divider().padding(.bottom, 8)

                VStack(alignment: .trailing, spacing: 5) {
                    ForEach(features, id: \.self) { f in
                        Text(f)
                            .font(.rubik(12))
                            .foregroundColor(.finiInkSoft)
                            .frame(maxWidth: .infinity, alignment: .trailing)
                    }
                    ForEach(lockedFeatures, id: \.self) { f in
                        HStack(spacing: 4) {
                            FiniIcon(name: "lock", size: 10, color: .finiInkMute)
                            Text(f)
                                .font(.rubik(12))
                                .foregroundColor(.finiInkMute)
                        }
                        .frame(maxWidth: .infinity, alignment: .trailing)
                    }
                }
            }
            .padding(14)
            .background(Color.white)
            .cornerRadius(20)
            .overlay(
                RoundedRectangle(cornerRadius: 20)
                    .stroke(isSelected ? accentColor : Color.finiLine, lineWidth: isSelected ? 2 : 1)
            )
            .shadow(color: isSelected ? accentColor.opacity(0.2) : Color.finiInk.opacity(0.04),
                    radius: isSelected ? 12 : 4, y: isSelected ? 4 : 2)
        }
    }
}

struct ProPlusPlanCard: View {
    let isSelected: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 14) {
                VStack(alignment: .trailing, spacing: 2) {
                    HStack(spacing: 8) {
                        Text("Pro+")
                            .font(.rubik(20, weight: .bold))
                            .foregroundColor(.finiInk)
                        Text("עבור זוגות")
                            .font(.rubik(12))
                            .foregroundColor(.finiBlue)
                            .padding(.horizontal, 8).padding(.vertical, 3)
                            .background(Color.finiLavender)
                            .cornerRadius(8)
                    }
                    Text("ניהול פיננסי משותף, תקציב זוגי, והכל מ-Pro")
                        .font(.rubik(12))
                        .foregroundColor(.finiInkMute)
                        .multilineTextAlignment(.trailing)
                }
                Spacer()
                VStack(alignment: .leading, spacing: 0) {
                    HStack(alignment: .firstTextBaseline, spacing: 2) {
                        Text("₪49")
                            .font(.rubik(22, weight: .bold))
                            .foregroundColor(.finiInk)
                        Text("/חודש")
                            .font(.rubik(11))
                            .foregroundColor(.finiInkMute)
                    }
                    Text("לשני אנשים")
                        .font(.rubik(10))
                        .foregroundColor(.finiInkMute)
                }
            }
            .padding(16)
            .background(Color.white)
            .cornerRadius(20)
            .overlay(
                RoundedRectangle(cornerRadius: 20)
                    .stroke(isSelected ? Color.finiBlue : Color.finiLine, lineWidth: isSelected ? 2 : 1)
            )
            .shadow(color: isSelected ? Color.finiBlue.opacity(0.2) : Color.finiInk.opacity(0.04),
                    radius: isSelected ? 12 : 4, y: isSelected ? 4 : 2)
        }
    }
}
