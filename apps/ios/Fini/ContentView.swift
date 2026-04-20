import SwiftUI

struct ContentView: View {
    @EnvironmentObject var state: AppState

    var body: some View {
        Group {
            if \!state.onboardingComplete {
                OnboardingFlow()
            } else {
                MainTabView()
            }
        }
        .animation(.easeInOut(duration: 0.3), value: state.onboardingComplete)
    }
}
