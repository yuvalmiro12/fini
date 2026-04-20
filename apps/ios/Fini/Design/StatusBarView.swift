import SwiftUI

struct FiniStatusBar: View {
    var color: Color = .finiInk
    var body: some View {
        HStack {
            Text("9:41")
                .font(.rubik(17, weight: .semibold))
                .foregroundColor(color)
            Spacer()
            HStack(spacing: 6) {
                // Signal bars
                HStack(alignment: .bottom, spacing: 2) {
                    ForEach([4, 6, 8, 11] as [CGFloat], id: \.self) { h in
                        RoundedRectangle(cornerRadius: 0.5)
                            .fill(color)
                            .frame(width: 3, height: h)
                    }
                }
                // Battery
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 3)
                        .stroke(color.opacity(0.4), lineWidth: 1)
                        .frame(width: 22, height: 11)
                    RoundedRectangle(cornerRadius: 1.5)
                        .fill(color)
                        .frame(width: 18, height: 7)
                        .padding(.leading, 2)
                }
            }
        }
        .padding(.horizontal, 28)
        .frame(height: 54)
        .environment(\.layoutDirection, .leftToRight)
    }
}
