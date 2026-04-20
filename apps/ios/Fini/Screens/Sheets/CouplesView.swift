import SwiftUI

struct CouplesView: View {
    @EnvironmentObject var state: AppState

    let sharedTransactions: [(String, String, Double, String)] = [
        ("grocery",   "שופרסל",          -214, "נ"),
        ("rent",      "שכר דירה",         -1600, "י"),
        ("utility",   "חברת חשמל",       -144, "נ"),
        ("transport", "Gett × 3",         -41, "י"),
        ("fun",       "סינמה סיטי",       -96, "נ"),
    ]

    var body: some View {
        ZStack {
            Color.finiLavender.ignoresSafeArea()
            RadialGradient(
                colors: [Color(hex: "#C5CCF5"), Color.finiLavender.opacity(0)],
                center: .center, startRadius: 0, endRadius: 160
            )
            .frame(width: 300, height: 300)
            .offset(x: 90, y: -160)
            .allowsHitTesting(false)

            VStack(spacing: 0) {
                // Handle
                RoundedRectangle(cornerRadius: 3)
                    .fill(Color.finiInkMute.opacity(0.3))
                    .frame(width: 40, height: 5)
                    .padding(.top, 12).padding(.bottom, 10)

                // Header
                HStack {
                    Button { state.showCouples = false } label: {
                        FiniIcon(name: "close", size: 20, color: .finiInkSoft)
                            .padding(10)
                            .background(Color.white.opacity(0.6))
                            .cornerRadius(12)
                    }
                    Spacer()
                    VStack(spacing: 3) {
                        Text("נועה & יונתן")
                            .font(.rubik(18, weight: .bold))
                            .foregroundColor(.finiInk)
                        // PRO+ badge
                        Text("PRO+")
                            .font(.rubik(9, weight: .black))
                            .foregroundColor(.white)
                            .padding(.horizontal, 6).padding(.vertical, 2)
                            .background(
                                LinearGradient(
                                    colors: [Color.finiBlue, Color(hex: "#4A5BA4")],
                                    startPoint: .leading, endPoint: .trailing
                                )
                            )
                            .cornerRadius(6)
                    }
                    Spacer()
                    FiniIcon(name: "dots", size: 20, color: .finiInkSoft)
                        .padding(10)
                        .background(Color.white.opacity(0.6))
                        .cornerRadius(12)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 16)

                ScrollView {
                    VStack(spacing: 14) {
                        // Overlapping avatars
                        HStack(spacing: -16) {
                            Circle()
                                .fill(LinearGradient(
                                    colors: [Color(hex: "#7B9EF7"), Color.finiBlue],
                                    startPoint: .topLeading, endPoint: .bottomTrailing
                                ))
                                .frame(width: 64, height: 64)
                                .overlay(Text("י").font(.rubik(24, weight: .bold)).foregroundColor(.white))
                                .overlay(Circle().stroke(Color.finiLavender, lineWidth: 3))
                            Circle()
                                .fill(LinearGradient(
                                    colors: [Color.finiPink, Color(hex: "#B04878")],
                                    startPoint: .topLeading, endPoint: .bottomTrailing
                                ))
                                .frame(width: 64, height: 64)
                                .overlay(Text("נ").font(.rubik(24, weight: .bold)).foregroundColor(.white))
                                .overlay(Circle().stroke(Color.finiLavender, lineWidth: 3))
                        }
                        .padding(.bottom, 4)

                        // Budget card
                        VStack(spacing: 0) {
                            HStack {
                                Text("63% מהתקציב")
                                    .font(.rubik(12, weight: .semibold))
                                    .foregroundColor(.finiBlue)
                                    .padding(.horizontal, 8).padding(.vertical, 4)
                                    .background(Color.finiLavenderDeep)
                                    .cornerRadius(8)
                                Spacer()
                                VStack(alignment: .trailing, spacing: 2) {
                                    Text("תקציב משותף")
                                        .font(.rubik(12))
                                        .foregroundColor(.finiInkMute)
                                    HStack(alignment: .firstTextBaseline, spacing: 2) {
                                        Text("מתוך ₪5,000")
                                            .font(.rubik(12))
                                            .foregroundColor(.finiInkMute)
                                        Text("₪3,140")
                                            .font(.rubik(26, weight: .bold))
                                            .foregroundColor(.finiInk)
                                    }
                                }
                            }
                            .padding(.bottom, 12)

                            // Progress bar
                            GeometryReader { geo in
                                ZStack(alignment: .trailing) {
                                    RoundedRectangle(cornerRadius: 6)
                                        .fill(Color.finiLavenderDeep)
                                        .frame(height: 10)
                                    RoundedRectangle(cornerRadius: 6)
                                        .fill(
                                            LinearGradient(
                                                colors: [Color.finiBlue, Color(hex: "#4A5BA4")],
                                                startPoint: .trailing, endPoint: .leading
                                            )
                                        )
                                        .frame(width: geo.size.width * 0.63, height: 10)
                                }
                            }
                            .frame(height: 10)
                            .padding(.bottom, 12)

                            // Split
                            HStack {
                                VStack(spacing: 2) {
                                    Text("יונתן")
                                        .font(.rubik(11))
                                        .foregroundColor(.finiInkMute)
                                    Text("₪1,620")
                                        .font(.rubik(15, weight: .bold))
                                        .foregroundColor(.finiBlue)
                                }
                                Spacer()
                                VStack(spacing: 2) {
                                    Text("נועה")
                                        .font(.rubik(11))
                                        .foregroundColor(.finiInkMute)
                                    Text("₪1,520")
                                        .font(.rubik(15, weight: .bold))
                                        .foregroundColor(.finiPink)
                                }
                            }
                        }
                        .padding(16)
                        .background(Color.white)
                        .cornerRadius(20)
                        .shadow(color: Color.finiBlue.opacity(0.1), radius: 8, y: 4)
                        .padding(.horizontal, 16)

                        // Shared transactions
                        VStack(spacing: 0) {
                            HStack {
                                Spacer()
                                Text("עסקאות משותפות")
                                    .font(.rubik(16, weight: .bold))
                                    .foregroundColor(.finiInk)
                            }
                            .padding(.bottom, 10)

                            ForEach(Array(sharedTransactions.enumerated()), id: \.0) { i, tx in
                                HStack(spacing: 12) {
                                    // Who paid avatar
                                    Circle()
                                        .fill(tx.3 == "נ" ?
                                              LinearGradient(colors: [Color.finiPink, Color(hex: "#B04878")], startPoint: .top, endPoint: .bottom) :
                                              LinearGradient(colors: [Color(hex: "#7B9EF7"), Color.finiBlue], startPoint: .top, endPoint: .bottom)
                                        )
                                        .frame(width: 28, height: 28)
                                        .overlay(Text(tx.3).font(.rubik(11, weight: .bold)).foregroundColor(.white))
                                    VStack(alignment: .trailing, spacing: 2) {
                                        Text(tx.1)
                                            .font(.rubik(14, weight: .medium))
                                            .foregroundColor(.finiInk)
                                        if let def = CATS[tx.0] {
                                            Text(def.label)
                                                .font(.rubik(11))
                                                .foregroundColor(.finiInkMute)
                                        }
                                    }
                                    Spacer()
                                    Text("-₪\(Int(abs(tx.2)))")
                                        .font(.rubik(15, weight: .bold))
                                        .foregroundColor(.finiExpense)
                                    CatIcon(cat: tx.0, size: 36, radius: 10)
                                }
                                .padding(.vertical, 10)
                                if i < sharedTransactions.count - 1 {
                                    Divider()
                                }
                            }
                        }
                        .padding(16)
                        .background(Color.white)
                        .cornerRadius(20)
                        .shadow(color: Color.finiInk.opacity(0.04), radius: 6, y: 3)
                        .padding(.horizontal, 16)

                        // Fini rose tip card
                        HStack(spacing: 10) {
                            FiniAvatar(size: 32, mood: .talk)
                            Text("השבוע יונתן שילם יותר — כדאי לאזן לפני סוף החודש 💡")
                                .font(.rubik(13))
                                .foregroundColor(.finiInkSoft)
                                .multilineTextAlignment(.trailing)
                        }
                        .padding(14)
                        .background(Color.finiRose)
                        .cornerRadius(16)
                        .padding(.horizontal, 16)

                        Spacer().frame(height: 40)
                    }
                }
            }
        }
    }
}
