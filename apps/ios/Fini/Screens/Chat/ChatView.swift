import SwiftUI

struct ChatView: View {
    @EnvironmentObject var state: AppState

    var body: some View {
        ZStack(alignment: .bottom) {
            Color.finiRose.ignoresSafeArea()
            VStack(spacing: 0) {
                FiniStatusBar()
                ChatHeaderView()
                ScrollView {
                    VStack(alignment: .trailing, spacing: 0) {
                        DateDividerView(text: "היום · 14 בנובמבר")
                        FBubbleView(text: "בוקר טוב נועה ☀️ שמחה לראות אותך.", mood: .wave, tail: true)
                        FBubbleView(text: "הבוקר נכנסה משכורת של ₪12,400. רוצה שנחלק אותה לפי היעדים שלך?", mood: .happy, tail: false)
                        SuggChipsView(chips: ["חלקי אוטומטית", "לא תודה", "תזכירי לי בערב"])
                        UBubbleView(text: "שילמתי 68 ש״ח על קפה ומאפה ב״לחמים״")
                        FBubbleView(text: "סידרתי\! הוספתי למסעדות:", mood: .talk, tail: true)
                        TxChipView(cat: "food", title: "לחמים, ת״א", amount: 68, time: "08:12")
                            .padding(.leading, 42)
                        SuggChipsView(chips: ["קבעי תקציב לקטגוריה", "הראי לי פירוט"])
                        // Extra sample insight card
                        InsightChatCard()
                            .padding(.leading, 42)
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 180)
                }
            }
            // Composer
            ComposerView()
                .padding(.horizontal, 16)
                .padding(.bottom, 104)
        }
    }
}

struct ChatHeaderView: View {
    @EnvironmentObject var state: AppState
    var body: some View {
        HStack(spacing: 12) {
            ZStack(alignment: .bottomLeading) {
                FiniAvatar(size: 44, mood: .happy)
                Circle().fill(Color(hex: "#5BC17B")).frame(width: 12, height: 12)
                    .overlay(Circle().stroke(Color.finiRose, lineWidth: 2))
            }
            VStack(alignment: .trailing, spacing: 2) {
                Text("פיני")
                    .font(.rubik(18, weight: .bold))
                    .foregroundColor(.finiInk)
                Text("פעילה • קוראת את ההוצאות שלך")
                    .font(.rubik(12))
                    .foregroundColor(.finiInkSoft)
            }
            Spacer()
            HeaderButton(icon: "calendar")
            HeaderButton(icon: "dots")
        }
        .padding(.horizontal, 20).padding(.vertical, 12)
    }
}

struct HeaderButton: View {
    let icon: String
    var body: some View {
        RoundedRectangle(cornerRadius: 14)
            .fill(Color.white)
            .frame(width: 40, height: 40)
            .overlay(FiniIcon(name: icon, size: 20))
            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.finiLine, lineWidth: 1))
    }
}

struct DateDividerView: View {
    let text: String
    var body: some View {
        Text(text)
            .font(.rubik(12))
            .foregroundColor(.finiInkMute)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
    }
}

struct FBubbleView: View {
    let text: String
    var mood: FiniMood = .happy
    var tail: Bool = true
    var body: some View {
        HStack(alignment: .bottom, spacing: 10) {
            if tail {
                FiniAvatar(size: 32, mood: mood)
            } else {
                Spacer().frame(width: 32)
            }
            Text(text)
                .font(.rubik(15))
                .foregroundColor(.finiInk)
                .padding(.horizontal, 16).padding(.vertical, 12)
                .background(Color.white)
                .clipShape(RoundedShape(tl: tail ? 6 : 20, tr: 20, bl: 20, br: 20))
                .shadow(color: Color.finiInk.opacity(0.04), radius: 1, y: 1)
                .frame(maxWidth: 280, alignment: .trailing)
            Spacer()
        }
        .padding(.bottom, 8)
    }
}

struct UBubbleView: View {
    let text: String
    var body: some View {
        HStack {
            Text(text)
                .font(.rubik(15))
                .foregroundColor(.white)
                .padding(.horizontal, 16).padding(.vertical, 11)
                .background(Color.finiInk)
                .clipShape(RoundedShape(tl: 20, tr: 20, bl: 20, br: 6))
                .frame(maxWidth: 260)
            Spacer()
        }
        .padding(.bottom, 8)
    }
}

// Custom rounded shape for asymmetric radii
struct RoundedShape: Shape {
    var tl, tr, bl, br: CGFloat
    func path(in rect: CGRect) -> Path {
        var p = Path()
        p.move(to: CGPoint(x: rect.minX + tl, y: rect.minY))
        p.addLine(to: CGPoint(x: rect.maxX - tr, y: rect.minY))
        p.addArc(center: CGPoint(x: rect.maxX - tr, y: rect.minY + tr), radius: tr,
                 startAngle: .degrees(-90), endAngle: .degrees(0), clockwise: false)
        p.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY - br))
        p.addArc(center: CGPoint(x: rect.maxX - br, y: rect.maxY - br), radius: br,
                 startAngle: .degrees(0), endAngle: .degrees(90), clockwise: false)
        p.addLine(to: CGPoint(x: rect.minX + bl, y: rect.maxY))
        p.addArc(center: CGPoint(x: rect.minX + bl, y: rect.maxY - bl), radius: bl,
                 startAngle: .degrees(90), endAngle: .degrees(180), clockwise: false)
        p.addLine(to: CGPoint(x: rect.minX, y: rect.minY + tl))
        p.addArc(center: CGPoint(x: rect.minX + tl, y: rect.minY + tl), radius: tl,
                 startAngle: .degrees(180), endAngle: .degrees(270), clockwise: false)
        p.closeSubpath()
        return p
    }
}

struct SuggChipsView: View {
    let chips: [String]
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(chips, id: \.self) { chip in
                    Text(chip)
                        .font(.rubik(13, weight: .medium))
                        .foregroundColor(.finiPink)
                        .padding(.horizontal, 14).padding(.vertical, 9)
                        .background(Color.white.opacity(0.7))
                        .cornerRadius(14)
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.finiPinkSoft, lineWidth: 1))
                }
            }
        }
        .padding(.leading, 42)
        .padding(.bottom, 16)
    }
}

struct TxChipView: View {
    let cat: String
    let title: String
    let amount: Double
    let time: String
    var body: some View {
        if let def = CATS[cat] {
            HStack(spacing: 12) {
                CatIcon(cat: cat, size: 42)
                VStack(alignment: .trailing, spacing: 2) {
                    Text(title)
                        .font(.rubik(15, weight: .semibold))
                        .foregroundColor(.finiInk)
                    Text("\(def.label) · \(time)")
                        .font(.rubik(12))
                        .foregroundColor(.finiInkMute)
                }
                Spacer()
                Text("-₪\(Int(amount))")
                    .font(.rubik(16, weight: .bold))
                    .foregroundColor(.finiExpense)
            }
            .padding(12)
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: Color.finiInk.opacity(0.04), radius: 1, y: 1)
            .padding(.bottom, 8)
        }
    }
}

struct InsightChatCard: View {
    var body: some View {
        VStack(alignment: .trailing, spacing: 10) {
            HStack {
                Text("תובנה שבועית")
                    .font(.rubik(11, weight: .semibold))
                    .foregroundColor(.finiGreen)
                Spacer()
                FiniIcon(name: "sparkle", size: 16, color: .finiGreen)
            }
            Text("השבוע הוצאת 18% פחות על מסעדות מהשבוע שעבר — המשיכי כך 💪")
                .font(.rubik(14))
                .foregroundColor(.finiInkSoft)
                .multilineTextAlignment(.trailing)
        }
        .padding(14)
        .background(Color.finiMint)
        .cornerRadius(16)
        .padding(.bottom, 16)
    }
}

struct ComposerView: View {
    @EnvironmentObject var state: AppState
    var body: some View {
        HStack(spacing: 8) {
            FiniIcon(name: "camera", size: 22, color: .finiInkMute)
            Button { state.showAddTx = true } label: {
                FiniIcon(name: "plus", size: 22, color: .finiInkMute)
            }
            Text("תכתבי לפיני...")
                .font(.rubik(15))
                .foregroundColor(.finiInkMute)
                .frame(maxWidth: .infinity)
            Circle()
                .fill(Color.finiPink)
                .frame(width: 40, height: 40)
                .overlay(FiniIcon(name: "mic", size: 20, color: .white))
                .shadow(color: Color.finiPink.opacity(0.3), radius: 4, y: 2)
        }
        .padding(.leading, 14).padding(.trailing, 6).padding(.vertical, 6)
        .background(Color.white)
        .cornerRadius(24)
        .shadow(color: Color.finiInk.opacity(0.06), radius: 8, y: 4)
    }
}
