import SwiftUI

struct InsightsView: View {
    @EnvironmentObject var state: AppState

    var body: some View {
        ZStack(alignment: .bottom) {
            Color.finiMint.ignoresSafeArea()
            RadialGradient(
                colors: [Color(hex: "#C5E8D5"), Color.finiMint.opacity(0)],
                center: .center, startRadius: 0, endRadius: 180
            )
            .frame(width: 320, height: 320)
            .offset(x: 100, y: -160)
            .allowsHitTesting(false)

            ScrollView {
                VStack(spacing: 0) {
                    FiniStatusBar()

                    // Header
                    HStack {
                        ZStack(alignment: .topLeading) {
                            Button {
                                // no-op
                            } label: {
                                FiniIcon(name: "bell", size: 24, color: .finiInkSoft)
                            }
                            Circle().fill(Color.finiPink).frame(width: 8, height: 8).offset(x: -2, y: -2)
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 2) {
                            Text("היי נועה 🌿")
                                .font(.rubik(15))
                                .foregroundColor(.finiInkMute)
                            Text("תובנות")
                                .font(.rubik(28, weight: .bold))
                                .foregroundColor(.finiInk)
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 20)

                    // Savings hero card
                    Button { state.showSavings = true } label: {
                        SavingsHeroCard()
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 16)

                    // Weekly insights
                    HStack {
                        Spacer()
                        Text("התובנות של השבוע")
                            .font(.rubik(18, weight: .bold))
                            .foregroundColor(.finiInk)
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 12)

                    VStack(spacing: 10) {
                        InsightRowView(
                            icon: "trend",
                            iconBg: Color.finiIncomeTint,
                            iconColor: Color.finiIncome,
                            title: "הוצאות ירדו ב-14%",
                            subtitle: "לעומת אוקטובר — עבודה טובה\!",
                            badge: nil
                        )
                        InsightRowView(
                            icon: "bolt",
                            iconBg: Color.finiExpenseTint,
                            iconColor: Color.finiExpense,
                            title: "חשמל: עלייה חריגה",
                            subtitle: "₪288 החודש, פי 1.4 מהממוצע",
                            badge: "שים לב"
                        )
                        InsightRowView(
                            icon: "target",
                            iconBg: Color.finiGoldTint,
                            iconColor: Color.finiGold,
                            title: "56% לקראת יפן",
                            subtitle: "עוד ₪6,580 · ביצוע חודשי: ₪650",
                            badge: nil
                        )
                    }
                    .padding(.horizontal, 16)

                    Spacer().frame(height: 120)
                }
            }

            CustomTabBar()
        }
        .ignoresSafeArea(edges: .bottom)
    }
}

struct SavingsHeroCard: View {
    var body: some View {
        VStack(spacing: 0) {
            // Top row
            HStack {
                HStack(spacing: 6) {
                    Text("🎯")
                        .font(.system(size: 13))
                    Text("יעד חיסכון")
                        .font(.rubik(12, weight: .medium))
                        .foregroundColor(.finiGreen)
                }
                .padding(.horizontal, 10).padding(.vertical, 5)
                .background(Color.finiMintDeep)
                .cornerRadius(10)
                Spacer()
                FiniIcon(name: "arrow", size: 18, color: .finiInkMute)
            }
            .padding(.bottom, 10)

            // Goal name
            Text("טיול ליפן · אוקטובר 2026")
                .font(.rubik(16, weight: .bold))
                .foregroundColor(.finiInk)
                .frame(maxWidth: .infinity, alignment: .trailing)
                .padding(.bottom, 6)

            // Amount row
            HStack(alignment: .firstTextBaseline) {
                Text("מתוך ₪15,000")
                    .font(.rubik(13))
                    .foregroundColor(.finiInkMute)
                Spacer()
                HStack(alignment: .firstTextBaseline, spacing: 2) {
                    Text("₪")
                        .font(.rubik(18, weight: .medium))
                        .foregroundColor(.finiGreen)
                    Text("8,420")
                        .font(.rubik(32, weight: .bold))
                        .foregroundColor(.finiInk)
                }
            }
            .padding(.bottom, 10)

            // Progress bar
            GeometryReader { geo in
                ZStack(alignment: .trailing) {
                    RoundedRectangle(cornerRadius: 6)
                        .fill(Color.finiMintDeep)
                        .frame(height: 10)
                    RoundedRectangle(cornerRadius: 6)
                        .fill(
                            LinearGradient(
                                colors: [Color.finiGreen, Color(hex: "#4DB37E")],
                                startPoint: .trailing,
                                endPoint: .leading
                            )
                        )
                        .frame(width: geo.size.width * 0.56, height: 10)

                    // 56% pill
                    Text("56%")
                        .font(.rubik(10, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 6).padding(.vertical, 2)
                        .background(Color.finiGreen)
                        .cornerRadius(8)
                        .offset(x: -geo.size.width * 0.56 + 28)
                }
            }
            .frame(height: 10)
            .padding(.bottom, 12)

            // Stats row
            HStack {
                StatChip(label: "חודשי", value: "₪650", color: .finiGreen)
                Spacer()
                StatChip(label: "נותר", value: "₪6,580", color: .finiExpense)
                Spacer()
                StatChip(label: "יישאר", value: "אוג׳", color: .finiGold)
            }
            .padding(.bottom, 12)

            // Fini tip
            HStack(spacing: 10) {
                FiniAvatar(size: 28, mood: .talk)
                Text("הגדלת ₪50 בחודש מקצרת את המסלול ב-2 חודשים 💡")
                    .font(.rubik(13))
                    .foregroundColor(.finiInkSoft)
                    .multilineTextAlignment(.trailing)
                Spacer()
                FiniIcon(name: "lock", size: 14, color: .finiGold)
            }
            .padding(10)
            .background(Color.finiGoldTint)
            .cornerRadius(12)
        }
        .padding(18)
        .background(Color.white)
        .cornerRadius(22)
        .shadow(color: Color.finiInk.opacity(0.06), radius: 10, y: 4)
    }
}

struct StatChip: View {
    let label: String
    let value: String
    let color: Color
    var body: some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.rubik(15, weight: .bold))
                .foregroundColor(color)
            Text(label)
                .font(.rubik(11))
                .foregroundColor(.finiInkMute)
        }
    }
}

struct InsightRowView: View {
    let icon: String
    let iconBg: Color
    let iconColor: Color
    let title: String
    let subtitle: String
    let badge: String?
    var body: some View {
        HStack(spacing: 14) {
            RoundedRectangle(cornerRadius: 12)
                .fill(iconBg)
                .frame(width: 44, height: 44)
                .overlay(FiniIcon(name: icon, size: 22, color: iconColor))
            VStack(alignment: .trailing, spacing: 3) {
                Text(title)
                    .font(.rubik(15, weight: .semibold))
                    .foregroundColor(.finiInk)
                Text(subtitle)
                    .font(.rubik(12))
                    .foregroundColor(.finiInkMute)
            }
            Spacer()
            if let badge = badge {
                Text(badge)
                    .font(.rubik(11, weight: .semibold))
                    .foregroundColor(.finiExpense)
                    .padding(.horizontal, 8).padding(.vertical, 4)
                    .background(Color.finiExpenseTint)
                    .cornerRadius(8)
            } else {
                FiniIcon(name: "arrow", size: 16, color: .finiInkMute)
            }
        }
        .padding(14)
        .background(Color.white)
        .cornerRadius(18)
        .shadow(color: Color.finiInk.opacity(0.04), radius: 4, y: 2)
    }
}

// MARK: - Savings Goal Sheet

struct SavingsGoalView: View {
    @EnvironmentObject var state: AppState

    let milestones: [(String, Double, Color)] = [
        ("פתיחת חיסכון", 0,    .finiGreen),
        ("25% הושג",     0.25, .finiGreen),
        ("חצי הדרך",    0.5,  .finiGreen),
        ("75% הושג",     0.75, .finiGreenSoft),
        ("יפן\! ✈️",      1.0,  .finiInkMute),
    ]

    var body: some View {
        ZStack {
            Color.finiMint.ignoresSafeArea()
            VStack(spacing: 0) {
                // Handle
                RoundedRectangle(cornerRadius: 3)
                    .fill(Color.finiInkMute.opacity(0.3))
                    .frame(width: 40, height: 5)
                    .padding(.top, 12)
                    .padding(.bottom, 8)

                // Header
                HStack {
                    Button { state.showSavings = false } label: {
                        FiniIcon(name: "close", size: 20, color: .finiInkSoft)
                            .padding(10)
                            .background(Color.white.opacity(0.6))
                            .cornerRadius(12)
                    }
                    Spacer()
                    Text("יעד חיסכון")
                        .font(.rubik(18, weight: .bold))
                        .foregroundColor(.finiInk)
                    Spacer()
                    FiniIcon(name: "dots", size: 20, color: .finiInkSoft)
                        .padding(10)
                        .background(Color.white.opacity(0.6))
                        .cornerRadius(12)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 20)

                // Circular progress ring card
                VStack(spacing: 12) {
                    Text("🗾 טיול ליפן · אוקטובר 2026")
                        .font(.rubik(13, weight: .medium))
                        .foregroundColor(.finiInkMute)

                    ZStack {
                        // Track
                        Circle()
                            .stroke(Color.finiMintDeep, style: StrokeStyle(lineWidth: 14, lineCap: .round))
                            .frame(width: 180, height: 180)
                        // Progress (56%)
                        Circle()
                            .trim(from: 0, to: 0.56)
                            .stroke(
                                LinearGradient(
                                    colors: [Color.finiGreen, Color(hex: "#4DB37E")],
                                    startPoint: .trailing,
                                    endPoint: .leading
                                ),
                                style: StrokeStyle(lineWidth: 14, lineCap: .round)
                            )
                            .frame(width: 180, height: 180)
                            .rotationEffect(.degrees(-90))
                        // Center text
                        VStack(spacing: 4) {
                            Text("חסכת עד עכשיו")
                                .font(.rubik(11))
                                .foregroundColor(.finiInkMute)
                            Text("₪8,420")
                                .font(.rubik(26, weight: .bold))
                                .foregroundColor(.finiInk)
                            Text("56% מהדרך")
                                .font(.rubik(12, weight: .medium))
                                .foregroundColor(.finiGreen)
                        }
                    }

                    // Stats row
                    HStack {
                        StatPill(label: "חסר", value: "₪6,580", color: .finiExpense)
                        Spacer()
                        StatPill(label: "חודשי", value: "₪650", color: .finiGreen)
                        Spacer()
                        StatPill(label: "יישאר", value: "אוג׳", color: .finiGold)
                    }
                }
                .padding(20)
                .background(Color.white)
                .cornerRadius(24)
                .shadow(color: Color.finiInk.opacity(0.06), radius: 10, y: 4)
                .padding(.horizontal, 16)
                .padding(.bottom, 16)

                // Timeline card
                VStack(spacing: 0) {
                    HStack {
                        Spacer()
                        Text("ציר הזמן")
                            .font(.rubik(16, weight: .bold))
                            .foregroundColor(.finiInk)
                    }
                    .padding(.bottom, 14)

                    ForEach(Array(milestones.enumerated()), id: \.0) { i, milestone in
                        HStack(spacing: 14) {
                            VStack {
                                if i < milestones.count - 1 {
                                    Rectangle()
                                        .fill(milestone.0 == "פתיחת חיסכון" ? Color.finiGreen : (milestone.2 == .finiGreen ? Color.finiGreen : Color.finiInkMute.opacity(0.2)))
                                        .frame(width: 2, height: 28)
                                }
                            }
                            .frame(width: 2)
                            Circle()
                                .fill(milestone.2)
                                .frame(width: 10, height: 10)
                            Text(milestone.0)
                                .font(.rubik(14, weight: milestone.1 <= 0.56 ? .medium : .regular))
                                .foregroundColor(milestone.1 <= 0.56 ? .finiInk : .finiInkMute)
                            Spacer()
                            if milestone.1 <= 0.56 {
                                FiniIcon(name: "check", size: 14, color: .finiGreen)
                            }
                        }
                        .frame(height: 36)
                    }
                }
                .padding(18)
                .background(Color.white)
                .cornerRadius(20)
                .shadow(color: Color.finiInk.opacity(0.04), radius: 6, y: 3)
                .padding(.horizontal, 16)

                Spacer()
            }
        }
    }
}

struct StatPill: View {
    let label: String
    let value: String
    let color: Color
    var body: some View {
        VStack(spacing: 3) {
            Text(value)
                .font(.rubik(18, weight: .bold))
                .foregroundColor(color)
            Text(label)
                .font(.rubik(11))
                .foregroundColor(.finiInkMute)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 10)
        .background(color.opacity(0.08))
        .cornerRadius(14)
    }
}
