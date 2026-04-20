import SwiftUI

struct TxDetailSheet: View {
    @EnvironmentObject var state: AppState

    // Fallback transaction
    var tx: Transaction {
        state.selectedTransaction ?? Transaction(
            id: "t1", cat: "food", title: "לחמים", subtitle: "08:12 · כרטיס אשראי",
            amount: -68, date: "14.11.2024",
            address: "רחוב אבן גבירול 139, תל אביב",
            paymentMethod: "כרטיס אשראי · 4821"
        )
    }

    let actions: [(String, String, String)] = [
        ("tag",     "ערכי קטגוריה",     "שנה את הסיווג"),
        ("receipt", "הוסיפי קבלה",     "צלמי קבלה"),
        ("users",   "שיתוף עם יונתן",  "עסקה משותפת"),
        ("bell",    "תזכורת חוזרת",     "הגדירי תזכורת"),
    ]

    var body: some View {
        ZStack {
            Color.finiCream.ignoresSafeArea()
            VStack(spacing: 0) {
                // Handle
                RoundedRectangle(cornerRadius: 3)
                    .fill(Color.finiInkMute.opacity(0.3))
                    .frame(width: 40, height: 5)
                    .padding(.top, 12)
                    .padding(.bottom, 16)

                // Header: icon + title + amount
                VStack(spacing: 12) {
                    CatIcon(cat: tx.cat, size: 58, radius: 18)
                    Text(tx.title)
                        .font(.rubik(22, weight: .bold))
                        .foregroundColor(.finiInk)
                    Text(tx.amount > 0 ? "+₪\(Int(tx.amount))" : "₪\(Int(abs(tx.amount)))-")
                        .font(.rubik(36, weight: .bold))
                        .foregroundColor(tx.amount > 0 ? .finiIncome : .finiExpense)
                }
                .padding(.bottom, 16)

                // Chips row
                HStack(spacing: 8) {
                    if let def = CATS[tx.cat] {
                        HStack(spacing: 6) {
                            FiniIcon(name: def.icon, size: 14, color: def.ink)
                            Text(def.label)
                                .font(.rubik(13, weight: .medium))
                                .foregroundColor(def.ink)
                        }
                        .padding(.horizontal, 10).padding(.vertical, 6)
                        .background(def.tint)
                        .cornerRadius(10)
                    }
                    if let pm = tx.paymentMethod {
                        Text(pm)
                            .font(.rubik(12))
                            .foregroundColor(.finiInkSoft)
                            .padding(.horizontal, 10).padding(.vertical, 6)
                            .background(Color.finiCreamDark)
                            .cornerRadius(10)
                    }
                    Text(tx.date)
                        .font(.rubik(12))
                        .foregroundColor(.finiInkMute)
                        .padding(.horizontal, 10).padding(.vertical, 6)
                        .background(Color.finiCreamDark)
                        .cornerRadius(10)
                }
                .padding(.bottom, 14)

                // Address
                if let addr = tx.address {
                    HStack(spacing: 8) {
                        Spacer()
                        Text(addr)
                            .font(.rubik(13))
                            .foregroundColor(.finiInkSoft)
                        FiniIcon(name: "target", size: 16, color: .finiInkMute)
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 14)
                }

                // Fini note card
                HStack(spacing: 10) {
                    FiniAvatar(size: 30, mood: .talk)
                    Text("זוהי קפיטריה/בית קפה. לרוב מתאים לקטגוריית \"מסעדות\" — נכון?")
                        .font(.rubik(13))
                        .foregroundColor(.finiInkSoft)
                        .multilineTextAlignment(.trailing)
                }
                .padding(14)
                .background(Color.finiRose)
                .cornerRadius(16)
                .padding(.horizontal, 16)
                .padding(.bottom, 14)

                // Action rows
                VStack(spacing: 0) {
                    ForEach(Array(actions.enumerated()), id: \.0) { i, action in
                        HStack(spacing: 14) {
                            Spacer()
                            VStack(alignment: .trailing, spacing: 2) {
                                Text(action.1)
                                    .font(.rubik(15, weight: .medium))
                                    .foregroundColor(.finiInk)
                                Text(action.2)
                                    .font(.rubik(12))
                                    .foregroundColor(.finiInkMute)
                            }
                            RoundedRectangle(cornerRadius: 11)
                                .fill(Color.finiCreamDark)
                                .frame(width: 40, height: 40)
                                .overlay(FiniIcon(name: action.0, size: 20, color: .finiInkSoft))
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 14)
                        if i < actions.count - 1 {
                            Divider().padding(.leading, 72)
                        }
                    }
                }
                .background(Color.white)
                .cornerRadius(20)
                .padding(.horizontal, 16)

                Spacer()
            }
        }
    }
}
