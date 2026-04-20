import SwiftUI

struct DataView: View {
    @EnvironmentObject var state: AppState
    @State private var selectedMonth = "נובמבר 2026"

    let months = ["ספטמבר 2026", "אוקטובר 2026", "נובמבר 2026"]

    var body: some View {
        ZStack(alignment: .bottom) {
            Color.finiLavender.ignoresSafeArea()
            RadialGradient(
                colors: [Color(hex: "#D0D8FF"), Color.finiLavender.opacity(0)],
                center: .center, startRadius: 0, endRadius: 160
            )
            .frame(width: 280, height: 280)
            .offset(x: 90, y: -150)
            .allowsHitTesting(false)

            ScrollView {
                VStack(spacing: 0) {
                    FiniStatusBar()

                    // Header
                    HStack {
                        // Month selector pill
                        Menu {
                            ForEach(months, id: \.self) { m in
                                Button(m) { selectedMonth = m }
                            }
                        } label: {
                            HStack(spacing: 6) {
                                FiniIcon(name: "calendar", size: 16, color: .finiBlue)
                                Text(selectedMonth)
                                    .font(.rubik(13, weight: .medium))
                                    .foregroundColor(.finiBlue)
                                FiniIcon(name: "arrowL", size: 12, color: .finiBlue)
                            }
                            .padding(.horizontal, 12).padding(.vertical, 7)
                            .background(Color.finiLavenderDeep)
                            .cornerRadius(12)
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 2) {
                            Text("סקירה")
                                .font(.rubik(13))
                                .foregroundColor(.finiInkMute)
                            Text("נתונים")
                                .font(.rubik(28, weight: .bold))
                                .foregroundColor(.finiInk)
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 20)

                    // Balance hero card
                    BalanceHeroCard()
                        .padding(.horizontal, 16)
                        .padding(.bottom, 14)

                    // 2-up cards
                    HStack(spacing: 12) {
                        // Savings YTD
                        SavingsYTDCard()
                        // Couples card
                        Button { state.showCouples = true } label: {
                            CouplesCardSmall()
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 14)

                    // Category breakdown
                    Button { state.showTransactions = true } label: {
                        CategoryBreakdownCard()
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

struct BalanceHeroCard: View {
    var body: some View {
        VStack(spacing: 0) {
            // Top
            HStack {
                HStack(spacing: 4) {
                    Circle().fill(Color(hex: "#5BC17B")).frame(width: 8, height: 8)
                    Text("+12%")
                        .font(.rubik(12, weight: .bold))
                        .foregroundColor(Color(hex: "#3E7354"))
                }
                .padding(.horizontal, 8).padding(.vertical, 4)
                .background(Color.finiIncomeTint)
                .cornerRadius(8)
                Spacer()
                VStack(alignment: .trailing, spacing: 2) {
                    Text("יתרה נטו")
                        .font(.rubik(13))
                        .foregroundColor(.finiInkMute)
                    HStack(alignment: .firstTextBaseline, spacing: 2) {
                        Text("₪")
                            .font(.rubik(20, weight: .medium))
                            .foregroundColor(.finiBlue)
                        Text("4,280")
                            .font(.rubik(38, weight: .bold))
                            .foregroundColor(.finiInk)
                            .tracking(-1)
                    }
                }
            }
            .padding(.bottom, 14)

            // Income / expense split bar
            GeometryReader { geo in
                let total = 12400.0 + 4468.0
                let incomeWidth = geo.size.width * (12400 / total)
                HStack(spacing: 3) {
                    RoundedRectangle(cornerRadius: 5)
                        .fill(Color.finiIncome)
                        .frame(width: incomeWidth, height: 8)
                    RoundedRectangle(cornerRadius: 5)
                        .fill(Color.finiExpense)
                        .frame(maxWidth: .infinity, minHeight: 8, maxHeight: 8)
                }
            }
            .frame(height: 8)
            .padding(.bottom, 10)

            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("הוצאות")
                        .font(.rubik(11))
                        .foregroundColor(.finiInkMute)
                    Text("₪4,468")
                        .font(.rubik(14, weight: .semibold))
                        .foregroundColor(.finiExpense)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 2) {
                    Text("הכנסות")
                        .font(.rubik(11))
                        .foregroundColor(.finiInkMute)
                    Text("₪12,400")
                        .font(.rubik(14, weight: .semibold))
                        .foregroundColor(.finiIncome)
                }
            }
            .padding(.bottom, 16)

            // Mini line chart
            MiniLineChart()
                .frame(height: 70)
        }
        .padding(18)
        .background(
            LinearGradient(
                colors: [Color.white, Color.finiLavender.opacity(0.5)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(FiniTokens.radiusXl)
        .shadow(color: Color.finiBlue.opacity(0.1), radius: 12, y: 5)
    }
}

struct MiniLineChart: View {
    let points: [CGFloat] = [0.5, 0.4, 0.6, 0.45, 0.7, 0.55, 0.8, 0.65, 0.9, 0.75, 0.85, 1.0]

    var body: some View {
        GeometryReader { geo in
            let w = geo.size.width
            let h = geo.size.height
            let step = w / CGFloat(points.count - 1)

            // Area fill
            Path { p in
                p.move(to: CGPoint(x: 0, y: h))
                for (i, pt) in points.enumerated() {
                    let x = CGFloat(i) * step
                    let y = h - pt * (h - 8)
                    if i == 0 { p.move(to: CGPoint(x: x, y: y)) }
                    else { p.addLine(to: CGPoint(x: x, y: y)) }
                }
                p.addLine(to: CGPoint(x: w, y: h))
                p.closeSubpath()
            }
            .fill(
                LinearGradient(
                    colors: [Color.finiBlue.opacity(0.2), Color.finiBlue.opacity(0)],
                    startPoint: .top,
                    endPoint: .bottom
                )
            )

            // Line
            Path { p in
                for (i, pt) in points.enumerated() {
                    let x = CGFloat(i) * step
                    let y = h - pt * (h - 8)
                    if i == 0 { p.move(to: CGPoint(x: x, y: y)) }
                    else { p.addLine(to: CGPoint(x: x, y: y)) }
                }
            }
            .stroke(Color.finiBlue, style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))

            // End dot
            Circle()
                .fill(Color.finiBlue)
                .frame(width: 8, height: 8)
                .position(x: w, y: h - points.last\! * (h - 8))
        }
    }
}

struct SavingsYTDCard: View {
    var body: some View {
        VStack(alignment: .trailing, spacing: 8) {
            HStack {
                FiniIcon(name: "piggy", size: 18, color: .finiGold)
                Spacer()
                Text("חיסכון YTD")
                    .font(.rubik(12))
                    .foregroundColor(.finiInkMute)
            }
            Text("₪18,340")
                .font(.rubik(22, weight: .bold))
                .foregroundColor(.finiInk)
                .frame(maxWidth: .infinity, alignment: .trailing)
            HStack(spacing: 4) {
                Circle().fill(Color(hex: "#5BC17B")).frame(width: 6, height: 6)
                Text("+8.4%")
                    .font(.rubik(11, weight: .medium))
                    .foregroundColor(Color(hex: "#3E7354"))
            }
            .frame(maxWidth: .infinity, alignment: .trailing)
        }
        .padding(14)
        .background(Color.white)
        .cornerRadius(18)
        .shadow(color: Color.finiInk.opacity(0.04), radius: 6, y: 3)
    }
}

struct CouplesCardSmall: View {
    var body: some View {
        VStack(alignment: .trailing, spacing: 8) {
            HStack {
                FiniIcon(name: "users", size: 18, color: .finiBlue)
                Spacer()
                Text("זוגי")
                    .font(.rubik(12))
                    .foregroundColor(.finiInkMute)
            }
            // Overlapping avatars
            HStack(spacing: -8) {
                Circle()
                    .fill(LinearGradient(colors: [Color(hex: "#7B9EF7"), Color.finiBlue], startPoint: .top, endPoint: .bottom))
                    .frame(width: 28, height: 28)
                    .overlay(Text("י").font(.rubik(12, weight: .bold)).foregroundColor(.white))
                Circle()
                    .fill(LinearGradient(colors: [Color.finiPink, Color(hex: "#B04878")], startPoint: .top, endPoint: .bottom))
                    .frame(width: 28, height: 28)
                    .overlay(Text("נ").font(.rubik(12, weight: .bold)).foregroundColor(.white))
                    .overlay(Circle().stroke(Color.white, lineWidth: 2))
            }
            .frame(maxWidth: .infinity, alignment: .trailing)
            Text("₪3,140 משותף")
                .font(.rubik(13, weight: .semibold))
                .foregroundColor(.finiInk)
                .frame(maxWidth: .infinity, alignment: .trailing)
            Text("63% מהתקציב")
                .font(.rubik(11))
                .foregroundColor(.finiInkMute)
                .frame(maxWidth: .infinity, alignment: .trailing)
        }
        .padding(14)
        .background(Color.white)
        .cornerRadius(18)
        .shadow(color: Color.finiInk.opacity(0.04), radius: 6, y: 3)
    }
}

struct CategoryBreakdownCard: View {
    let categories: [(String, Double, Color)] = [
        ("rent",      3200, .finiBlue),
        ("food",       650, Color(hex: "#B5662E")),
        ("grocery",    560, Color(hex: "#5E8040")),
        ("transport",  180, Color(hex: "#4A7390")),
        ("utility",    288, Color(hex: "#9B7C2E")),
    ]
    let total = 4878.0

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                HStack(spacing: 6) {
                    Text("לכל הפירוט")
                        .font(.rubik(13))
                        .foregroundColor(.finiBlue)
                    FiniIcon(name: "arrow", size: 14, color: .finiBlue)
                }
                Spacer()
                Text("פירוט לפי קטגוריה")
                    .font(.rubik(16, weight: .bold))
                    .foregroundColor(.finiInk)
            }
            .padding(.bottom, 14)

            // Stacked bar
            GeometryReader { geo in
                HStack(spacing: 2) {
                    ForEach(categories, id: \.0) { cat in
                        RoundedRectangle(cornerRadius: 4)
                            .fill(cat.2)
                            .frame(width: geo.size.width * (cat.1 / total))
                    }
                }
            }
            .frame(height: 10)
            .padding(.bottom, 14)

            VStack(spacing: 10) {
                ForEach(categories, id: \.0) { cat, amount, color in
                    HStack(spacing: 10) {
                        Text("-₪\(Int(amount))")
                            .font(.rubik(15, weight: .semibold))
                            .foregroundColor(.finiInk)
                        Spacer()
                        if let def = CATS[cat] {
                            Text(def.label)
                                .font(.rubik(13))
                                .foregroundColor(.finiInkSoft)
                        }
                        CatIcon(cat: cat, size: 36, radius: 10)
                    }
                }
            }
        }
        .padding(18)
        .background(Color.white)
        .cornerRadius(22)
        .shadow(color: Color.finiInk.opacity(0.05), radius: 8, y: 4)
    }
}

// MARK: - Transactions Full Screen

struct TransactionsView: View {
    @EnvironmentObject var state: AppState
    @State private var searchText = ""
    @State private var activeFilter = "הכל"

    let filters = ["הכל", "הכנסות", "הוצאות", "מסעדות", "תחבורה", "שכירות"]

    var body: some View {
        ZStack {
            Color.finiLavender.ignoresSafeArea()
            VStack(spacing: 0) {
                FiniStatusBar()

                // Header
                HStack {
                    Button { state.showTransactions = false } label: {
                        FiniIcon(name: "close", size: 20, color: .finiInkSoft)
                            .padding(10)
                            .background(Color.white.opacity(0.6))
                            .cornerRadius(12)
                    }
                    Spacer()
                    Text("עסקאות")
                        .font(.rubik(18, weight: .bold))
                        .foregroundColor(.finiInk)
                    Spacer()
                    FiniIcon(name: "filter", size: 20, color: .finiBlue)
                        .padding(10)
                        .background(Color.finiLavenderDeep)
                        .cornerRadius(12)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 12)

                // Search bar
                HStack(spacing: 10) {
                    FiniIcon(name: "search", size: 18, color: .finiInkMute)
                    Text("חיפוש עסקאות...")
                        .font(.rubik(15))
                        .foregroundColor(.finiInkMute)
                    Spacer()
                }
                .padding(.horizontal, 14).padding(.vertical, 11)
                .background(Color.white)
                .cornerRadius(14)
                .padding(.horizontal, 16)
                .padding(.bottom, 10)

                // Filter chips
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(filters, id: \.self) { filter in
                            let active = activeFilter == filter
                            Button { activeFilter = filter } label: {
                                Text(filter)
                                    .font(.rubik(13, weight: active ? .semibold : .regular))
                                    .foregroundColor(active ? .white : .finiInkSoft)
                                    .padding(.horizontal, 14).padding(.vertical, 8)
                                    .background(active ? Color.finiBlue : Color.white)
                                    .cornerRadius(12)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 12)
                                            .stroke(active ? Color.clear : Color.finiLine, lineWidth: 1)
                                    )
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                }
                .padding(.bottom, 12)

                // Transaction list
                ScrollView {
                    VStack(spacing: 0) {
                        ForEach(state.transactions) { group in
                            // Group header
                            HStack {
                                Spacer()
                                Text(group.label)
                                    .font(.rubik(12, weight: .medium))
                                    .foregroundColor(.finiInkMute)
                            }
                            .padding(.horizontal, 20)
                            .padding(.top, 16)
                            .padding(.bottom, 8)

                            VStack(spacing: 1) {
                                ForEach(group.items) { tx in
                                    TransactionRow(tx: tx)
                                        .onTapGesture {
                                            state.selectedTransaction = tx
                                            state.showTxDetail = true
                                        }
                                }
                            }
                            .background(Color.white)
                            .cornerRadius(18)
                            .padding(.horizontal, 16)
                        }
                        Spacer().frame(height: 40)
                    }
                }
            }
        }
    }
}

struct TransactionRow: View {
    let tx: Transaction
    var body: some View {
        HStack(spacing: 14) {
            CatIcon(cat: tx.cat, size: 44, radius: 13)
            VStack(alignment: .trailing, spacing: 3) {
                Text(tx.title)
                    .font(.rubik(15, weight: .semibold))
                    .foregroundColor(.finiInk)
                HStack(spacing: 6) {
                    if let flag = tx.flag {
                        Text(flag)
                            .font(.rubik(10, weight: .medium))
                            .foregroundColor(.finiGold)
                            .padding(.horizontal, 6).padding(.vertical, 2)
                            .background(Color.finiGoldTint)
                            .cornerRadius(6)
                    }
                    Text(tx.subtitle)
                        .font(.rubik(12))
                        .foregroundColor(.finiInkMute)
                }
            }
            Spacer()
            Text(tx.amount > 0 ? "+₪\(Int(tx.amount))" : "-₪\(Int(abs(tx.amount)))")
                .font(.rubik(16, weight: .bold))
                .foregroundColor(tx.amount > 0 ? .finiIncome : .finiExpense)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }
}
