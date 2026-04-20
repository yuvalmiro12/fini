import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var state: AppState

    var accent: Color {
        switch state.currentTab {
        case .chat: return .finiPink
        case .insights: return .finiGreen
        case .data: return .finiBlue
        }
    }

    var body: some View {
        ZStack(alignment: .bottom) {
            // Screen content
            Group {
                switch state.currentTab {
                case .chat:     ChatView()
                case .insights: InsightsView()
                case .data:     DataView()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            // Custom tab bar
            CustomTabBar()
        }
        .ignoresSafeArea(edges: .bottom)
        // Sheets
        .sheet(isPresented: $state.showTxDetail) { TxDetailSheet() }
        .sheet(isPresented: $state.showAddTx) { AddTxView() }
        .sheet(isPresented: $state.showPaywall) { PaywallView() }
        .sheet(isPresented: $state.showSavings) { SavingsGoalView() }
        .sheet(isPresented: $state.showCouples) { CouplesView() }
        .fullScreenCover(isPresented: $state.showTransactions) { TransactionsView() }
    }
}

struct CustomTabBar: View {
    @EnvironmentObject var state: AppState

    // RTL order: data | insights | chat
    let tabs: [(TabID, String, String)] = [
        (.data,     "נתונים",  "data"),
        (.insights, "תובנות", "insights"),
        (.chat,     "צ׳אט",   "chat"),
    ]

    var body: some View {
        VStack(spacing: 0) {
            Spacer()
            HStack(spacing: 0) {
                ForEach(tabs, id: \.0) { (id, label, icon) in
                    let active = state.currentTab == id
                    let accent: Color = id == .chat ? .finiPink : id == .insights ? .finiGreen : .finiBlue
                    Button {
                        let impact = UIImpactFeedbackGenerator(style: .light)
                        impact.impactOccurred()
                        state.currentTab = id
                    } label: {
                        VStack(spacing: 2) {
                            ZStack {
                                if active {
                                    RoundedRectangle(cornerRadius: 16)
                                        .fill(accent)
                                        .frame(width: 48, height: 32)
                                }
                                FiniIcon(name: icon, size: 22, color: active ? .white : .finiInkMute)
                            }
                            Text(label)
                                .font(.rubik(11, weight: active ? .medium : .regular))
                                .foregroundColor(active ? .finiInk : .finiInkMute)
                        }
                        .frame(maxWidth: .infinity)
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 28)
        }
        .background(
            LinearGradient(
                colors: [Color.white.opacity(0), Color.white.opacity(0.95)],
                startPoint: .top,
                endPoint: .bottom
            )
            .background(.ultraThinMaterial)
        )
    }
}
