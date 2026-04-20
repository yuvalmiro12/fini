import SwiftUI

struct ObWelcomeView: View {
    let onNext: () -> Void

    var body: some View {
        ZStack {
            Color.finiRose.ignoresSafeArea()
            // Aurora top-right
            RadialGradient(
                colors: [Color(hex: "#FFE6B8"), Color.finiRose.opacity(0)],
                center: .center, startRadius: 0, endRadius: 170
            )
            .frame(width: 340, height: 340)
            .offset(x: 110, y: -140)
            .allowsHitTesting(false)
            // Aurora bottom-left
            RadialGradient(
                colors: [Color(hex: "#FBC7D9"), Color.finiRose.opacity(0)],
                center: .center, startRadius: 0, endRadius: 140
            )
            .frame(width: 280, height: 280)
            .offset(x: -120, y: 200)
            .allowsHitTesting(false)

            VStack(spacing: 0) {
                FiniStatusBar()
                Spacer()
                FiniMascot(size: 180, mood: .wave)
                    .padding(.bottom, 24)
                VStack(spacing: 10) {
                    Text("נעים להכיר")
                        .font(.rubik(13, weight: .medium))
                        .foregroundColor(.finiPink)
                        .tracking(2)
                    Text("אני \(Text("פיני").foregroundColor(.finiPink)), העוזר הכספי שלך")
                        .font(.rubik(36, weight: .bold))
                        .multilineTextAlignment(.center)
                        .lineSpacing(4)
                        .tracking(-1.2)
                        .foregroundColor(.finiInk)
                    Text("בלי טבלאות מלחיצות. רק שיחה חמה על הכסף שלך — ואני כבר אדאג לשאר.")
                        .font(.rubik(17, weight: .regular))
                        .foregroundColor(.finiInkSoft)
                        .multilineTextAlignment(.center)
                        .lineSpacing(4)
                        .padding(.horizontal, 12)
                }
                .padding(.horizontal, 24)
                Spacer()
                VStack(spacing: 10) {
                    Button(action: onNext) {
                        HStack(spacing: 10) {
                            FiniIcon(name: "apple", size: 20, color: .white)
                            Text("המשך עם Apple")
                                .font(.rubik(17, weight: .semibold))
                                .foregroundColor(.white)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 17)
                        .background(Color.finiInk)
                        .cornerRadius(18)
                    }
                    Button(action: onNext) {
                        HStack(spacing: 10) {
                            FiniIcon(name: "google", size: 20, color: .finiInk)
                            Text("המשך עם Google")
                                .font(.rubik(17, weight: .medium))
                                .foregroundColor(.finiInk)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 17)
                        .background(Color.white)
                        .cornerRadius(18)
                        .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.finiLine, lineWidth: 1))
                    }
                    Text("בלחיצה על המשך את/ה מסכים/ה לתנאי שימוש ולפרטיות")
                        .font(.rubik(12))
                        .foregroundColor(.finiInkMute)
                        .multilineTextAlignment(.center)
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 48)
            }
        }
    }
}
