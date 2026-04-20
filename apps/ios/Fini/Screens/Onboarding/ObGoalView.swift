import SwiftUI

struct ObGoalView: View {
    let onNext: () -> Void
    let onBack: () -> Void
    @State private var selectedGoal: String? = nil

    let goals: [(String, String, String, String)] = [
        ("🎯", "לחסוך ליעד ספציפי", "חופשה, דירה, רכב...", "save-target"),
        ("💸", "להוציא פחות", "לנהל תקציב חכם יותר", "spend-less"),
        ("📊", "להבין לאן הכסף הולך", "תובנות על ההרגלים שלי", "understand"),
        ("👫", "לנהל כספים עם בן/בת זוג", "תכנון משותף", "couples"),
    ]

    var body: some View {
        ZStack {
            Color.finiRose.ignoresSafeArea()
            RadialGradient(
                colors: [Color(hex: "#FFE6B8"), Color.finiRose.opacity(0)],
                center: .center, startRadius: 0, endRadius: 160
            )
            .frame(width: 300, height: 300)
            .offset(x: 100, y: -160)
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
                        Text("2/5 · דילוג")
                            .font(.rubik(13, weight: .medium))
                            .foregroundColor(.finiInkMute)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 16)

                ProgressDots(total: 5, current: 1)
                    .padding(.bottom, 24)

                // Fini bubbles
                VStack(alignment: .trailing, spacing: 8) {
                    HStack(alignment: .bottom, spacing: 10) {
                        FiniAvatar(size: 32, mood: .happy)
                        Text("היי\! אני פיני 👋")
                            .font(.rubik(15))
                            .foregroundColor(.finiInk)
                            .padding(.horizontal, 16).padding(.vertical, 12)
                            .background(Color.white)
                            .clipShape(RoundedShape(tl: 6, tr: 20, bl: 20, br: 20))
                            .shadow(color: Color.finiInk.opacity(0.04), radius: 1, y: 1)
                        Spacer()
                    }
                    HStack(alignment: .bottom, spacing: 10) {
                        Spacer().frame(width: 32)
                        Text("מה הכי חשוב לך לעשות עם הכסף שלך?")
                            .font(.rubik(15))
                            .foregroundColor(.finiInk)
                            .padding(.horizontal, 16).padding(.vertical, 12)
                            .background(Color.white)
                            .clipShape(RoundedShape(tl: 20, tr: 20, bl: 20, br: 20))
                            .shadow(color: Color.finiInk.opacity(0.04), radius: 1, y: 1)
                        Spacer()
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 20)

                // Goal cards
                VStack(spacing: 10) {
                    ForEach(goals, id: \.3) { emoji, title, subtitle, key in
                        let selected = selectedGoal == key
                        Button {
                            selectedGoal = key
                        } label: {
                            HStack(spacing: 14) {
                                Text(emoji)
                                    .font(.system(size: 28))
                                    .frame(width: 48, height: 48)
                                    .background(selected ? Color.finiInk : Color.white)
                                    .cornerRadius(14)
                                VStack(alignment: .trailing, spacing: 3) {
                                    Text(title)
                                        .font(.rubik(16, weight: .semibold))
                                        .foregroundColor(selected ? .white : .finiInk)
                                    Text(subtitle)
                                        .font(.rubik(13))
                                        .foregroundColor(selected ? .white.opacity(0.7) : .finiInkMute)
                                }
                                Spacer()
                                if selected {
                                    ZStack {
                                        Circle().fill(Color.finiPink).frame(width: 24, height: 24)
                                        FiniIcon(name: "check", size: 14, color: .white)
                                    }
                                }
                            }
                            .padding(.horizontal, 16).padding(.vertical, 14)
                            .background(selected ? Color.finiInk : Color.white)
                            .cornerRadius(18)
                            .overlay(
                                RoundedRectangle(cornerRadius: 18)
                                    .stroke(selected ? Color.clear : Color.finiLine, lineWidth: 1)
                            )
                        }
                    }
                }
                .padding(.horizontal, 20)

                Spacer()

                Button(action: onNext) {
                    Text("הלאה")
                        .font(.rubik(17, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 17)
                        .background(selectedGoal \!= nil ? Color.finiPink : Color.finiInkMute)
                        .cornerRadius(18)
                        .shadow(color: (selectedGoal \!= nil ? Color.finiPink : Color.clear).opacity(0.3), radius: 8, y: 4)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 48)
                .disabled(false)
            }
        }
    }
}
