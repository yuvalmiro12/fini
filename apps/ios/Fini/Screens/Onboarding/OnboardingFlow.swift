import SwiftUI

struct OnboardingFlow: View {
    @EnvironmentObject var state: AppState
    @State private var step = 0  // 0=welcome, 1=goal, 2=income, 3=plan

    var body: some View {
        ZStack {
            switch step {
            case 0: ObWelcomeView(onNext: { step = 1 })
            case 1: ObGoalView(onNext: { step = 2 }, onBack: { step = 0 })
            case 2: ObIncomeView(onNext: { step = 3 }, onBack: { step = 1 })
            case 3: ObPlanView(onNext: {
                state.onboardingComplete = true
                UserDefaults.standard.set(true, forKey: "onboardingComplete")
            }, onBack: { step = 2 })
            default: EmptyView()
            }
        }
        .animation(.easeInOut(duration: 0.25), value: step)
    }
}

struct ProgressDots: View {
    let total: Int
    let current: Int
    var activeColor: Color = .finiPink
    var body: some View {
        HStack(spacing: 6) {
            ForEach(0..<total, id: \.self) { i in
                Capsule()
                    .fill(i == current ? activeColor : activeColor.opacity(0.2))
                    .frame(width: i == current ? 20 : 6, height: 6)
                    .animation(.spring(response: 0.3), value: current)
            }
        }
    }
}
