import SwiftUI

struct ObIncomeView: View {
    let onNext: () -> Void
    let onBack: () -> Void
    @State private var selectedType: String = "salary"
    @State private var amountText: String = "12,400"

    let incomeTypes: [(String, String, String)] = [
        ("wallet",  "שכיר/ה",          "salary"),
        ("target",  "עצמאי/ת",         "freelance"),
        ("users",   "עסק / שותפות",    "business"),
        ("sparkle", "הכנסה מרובת מקורות", "mixed"),
    ]

    var body: some View {
        ZStack {
            Color.finiRose.ignoresSafeArea()
            RadialGradient(
                colors: [Color(hex: "#FBC7D9"), Color.finiRose.opacity(0)],
                center: .center, startRadius: 0, endRadius: 150
            )
            .frame(width: 280, height: 280)
            .offset(x: -110, y: 160)
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
                    Button(action: onNext) {
                        Text("3/5 · דילוג")
                            .font(.rubik(13, weight: .medium))
                            .foregroundColor(.finiInkMute)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 16)

                ProgressDots(total: 5, current: 2)
                    .padding(.bottom, 24)

                // Fini bubble
                HStack(alignment: .bottom, spacing: 10) {
                    FiniAvatar(size: 32, mood: .talk)
                    Text("כדי לעזור לך לנהל תקציב, ספרי לי על ההכנסות שלך 💰")
                        .font(.rubik(15))
                        .foregroundColor(.finiInk)
                        .padding(.horizontal, 16).padding(.vertical, 12)
                        .background(Color.white)
                        .clipShape(RoundedShape(tl: 6, tr: 20, bl: 20, br: 20))
                        .shadow(color: Color.finiInk.opacity(0.04), radius: 1, y: 1)
                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 20)

                // Income type radio cards
                VStack(spacing: 8) {
                    ForEach(incomeTypes, id: \.2) { icon, label, key in
                        let selected = selectedType == key
                        Button { selectedType = key } label: {
                            HStack(spacing: 14) {
                                // Radio circle
                                ZStack {
                                    Circle()
                                        .stroke(selected ? Color.finiPink : Color.finiLine, lineWidth: 2)
                                        .frame(width: 22, height: 22)
                                    if selected {
                                        Circle().fill(Color.finiPink).frame(width: 12, height: 12)
                                    }
                                }
                                FiniIcon(name: icon, size: 20, color: selected ? .finiPink : .finiInkMute)
                                Text(label)
                                    .font(.rubik(15, weight: selected ? .medium : .regular))
                                    .foregroundColor(selected ? .finiInk : .finiInkSoft)
                                Spacer()
                            }
                            .padding(.horizontal, 16).padding(.vertical, 14)
                            .background(Color.white)
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(selected ? Color.finiPink.opacity(0.4) : Color.finiLine, lineWidth: 1.5)
                            )
                        }
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 16)

                // Amount card
                VStack(spacing: 0) {
                    HStack {
                        Text("משכורת נטו חודשית")
                            .font(.rubik(13, weight: .medium))
                            .foregroundColor(.finiInkMute)
                        Spacer()
                        // "בערך" gold chip
                        Text("בערך")
                            .font(.rubik(11, weight: .medium))
                            .foregroundColor(Color(hex: "#8A6E2C"))
                            .padding(.horizontal, 10).padding(.vertical, 4)
                            .background(Color.finiGoldTint)
                            .cornerRadius(8)
                    }
                    .padding(.horizontal, 16).padding(.top, 14).padding(.bottom, 8)

                    HStack(alignment: .firstTextBaseline, spacing: 4) {
                        Text("₪")
                            .font(.rubik(28, weight: .medium))
                            .foregroundColor(.finiInkMute)
                        Text(amountText)
                            .font(.rubik(48, weight: .bold))
                            .foregroundColor(.finiInk)
                            .tracking(-1)
                    }
                    .frame(maxWidth: .infinity, alignment: .trailing)
                    .padding(.horizontal, 16)
                    .padding(.bottom, 14)
                }
                .background(Color.white)
                .cornerRadius(20)
                .shadow(color: Color.finiInk.opacity(0.05), radius: 6, y: 3)
                .padding(.horizontal, 20)

                Spacer()

                Button(action: onNext) {
                    Text("הלאה")
                        .font(.rubik(17, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 17)
                        .background(Color.finiPink)
                        .cornerRadius(18)
                        .shadow(color: Color.finiPink.opacity(0.3), radius: 8, y: 4)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 48)
            }
        }
    }
}
