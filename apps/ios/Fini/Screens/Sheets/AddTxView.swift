import SwiftUI

struct AddTxView: View {
    @EnvironmentObject var state: AppState
    @State private var isExpense = true
    @State private var selectedCat = "food"
    @State private var description = ""
    @State private var amount = "0"

    let catKeys = ["food", "grocery", "rent", "transport", "utility", "salary", "gift", "phone", "fun", "save"]

    var body: some View {
        ZStack {
            Color.finiRose.ignoresSafeArea()
            RadialGradient(
                colors: [Color(hex: "#FFE6B8"), Color.finiRose.opacity(0)],
                center: .center, startRadius: 0, endRadius: 160
            )
            .frame(width: 280, height: 280)
            .offset(x: 80, y: -160)
            .allowsHitTesting(false)

            VStack(spacing: 0) {
                // Header
                HStack {
                    Button { state.showAddTx = false } label: {
                        FiniIcon(name: "close", size: 20, color: .finiInkSoft)
                            .padding(10)
                            .background(Color.white.opacity(0.6))
                            .cornerRadius(12)
                    }
                    Spacer()
                    Text("עסקה חדשה")
                        .font(.rubik(18, weight: .bold))
                        .foregroundColor(.finiInk)
                    Spacer()
                    Button { state.showAddTx = false } label: {
                        Text("שמירה")
                            .font(.rubik(15, weight: .semibold))
                            .foregroundColor(.finiPink)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 20)
                .padding(.bottom, 16)

                // Fini hint card
                HStack(spacing: 10) {
                    FiniAvatar(size: 30, mood: .talk)
                    Text("ספרי לי על העסקה ואני אסווג אוטומטית 😊")
                        .font(.rubik(13))
                        .foregroundColor(.finiInkSoft)
                    Spacer()
                }
                .padding(12)
                .background(Color.white.opacity(0.7))
                .cornerRadius(14)
                .padding(.horizontal, 20)
                .padding(.bottom, 16)

                // Amount display
                VStack(spacing: 8) {
                    // Toggle: expense / income
                    HStack(spacing: 0) {
                        Button { isExpense = true } label: {
                            Text("הוצאה")
                                .font(.rubik(14, weight: isExpense ? .semibold : .regular))
                                .foregroundColor(isExpense ? .white : .finiInkMute)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 9)
                                .background(isExpense ? Color.finiExpense : Color.clear)
                                .cornerRadius(12)
                        }
                        Button { isExpense = false } label: {
                            Text("הכנסה")
                                .font(.rubik(14, weight: \!isExpense ? .semibold : .regular))
                                .foregroundColor(\!isExpense ? .white : .finiInkMute)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 9)
                                .background(\!isExpense ? Color.finiIncome : Color.clear)
                                .cornerRadius(12)
                        }
                    }
                    .padding(4)
                    .background(Color.white.opacity(0.5))
                    .cornerRadius(16)
                    .padding(.horizontal, 20)

                    // Big amount
                    HStack(alignment: .firstTextBaseline, spacing: 4) {
                        Text("₪")
                            .font(.rubik(28, weight: .medium))
                            .foregroundColor(isExpense ? .finiExpense.opacity(0.6) : .finiIncome.opacity(0.6))
                        Text(amount)
                            .font(.rubik(56, weight: .bold))
                            .foregroundColor(isExpense ? .finiExpense : .finiIncome)
                            .tracking(-2)
                    }
                    .frame(maxWidth: .infinity, alignment: .center)
                    .onTapGesture { amount = "68" }
                }
                .padding(.bottom, 16)

                // Category grid (5 cols × 2 rows)
                let cols = Array(repeating: GridItem(.flexible(), spacing: 10), count: 5)
                LazyVGrid(columns: cols, spacing: 10) {
                    ForEach(catKeys, id: \.self) { key in
                        let selected = selectedCat == key
                        Button { selectedCat = key } label: {
                            VStack(spacing: 4) {
                                CatIcon(cat: key, size: 52, radius: 16)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 16)
                                            .stroke(selected ? Color.finiPink : Color.clear, lineWidth: 2.5)
                                    )
                                if let def = CATS[key] {
                                    Text(def.label)
                                        .font(.rubik(10, weight: selected ? .semibold : .regular))
                                        .foregroundColor(selected ? .finiPink : .finiInkMute)
                                        .lineLimit(1)
                                }
                            }
                        }
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 16)

                // Description row
                HStack(spacing: 10) {
                    Spacer()
                    Text(description.isEmpty ? "תיאור (אופציונלי)" : description)
                        .font(.rubik(15))
                        .foregroundColor(description.isEmpty ? .finiInkMute : .finiInk)
                    FiniIcon(name: "receipt", size: 20, color: .finiInkMute)
                }
                .padding(.horizontal, 16).padding(.vertical, 14)
                .background(Color.white)
                .cornerRadius(16)
                .padding(.horizontal, 20)
                .padding(.bottom, 8)

                // Date row
                HStack(spacing: 10) {
                    Spacer()
                    Text("היום · 14 בנובמבר")
                        .font(.rubik(15))
                        .foregroundColor(.finiInkSoft)
                    FiniIcon(name: "calendar", size: 20, color: .finiInkMute)
                }
                .padding(.horizontal, 16).padding(.vertical, 14)
                .background(Color.white)
                .cornerRadius(16)
                .padding(.horizontal, 20)

                Spacer()

                // CTA
                Button { state.showAddTx = false } label: {
                    Text("שמרי עסקה")
                        .font(.rubik(17, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 17)
                        .background(Color.finiPink)
                        .cornerRadius(18)
                        .shadow(color: Color.finiPink.opacity(0.35), radius: 10, y: 5)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 40)
            }
        }
    }
}
