import SwiftUI

extension Color {
    // Base
    static let finiCream       = Color(hex: "#F7F5E8")
    static let finiCreamDark   = Color(hex: "#EFEADA")
    static let finiInk         = Color(hex: "#1F1A15")
    static let finiInkSoft     = Color(hex: "#4A4237")
    static let finiInkMute     = Color(hex: "#8A8070")
    static let finiLine        = Color(hex: "#1F1A15").opacity(0.08)
    static let finiLineSoft    = Color(hex: "#1F1A15").opacity(0.05)
    // Chat / Rose
    static let finiRose        = Color(hex: "#FDDDE8")
    static let finiRoseDeep    = Color(hex: "#F9C6D7")
    static let finiPink        = Color(hex: "#C85A8A")
    static let finiPinkSoft    = Color(hex: "#E89AB3")
    // Insights / Mint
    static let finiMint        = Color(hex: "#D6EEE0")
    static let finiMintDeep    = Color(hex: "#BEE3CB")
    static let finiGreen       = Color(hex: "#5B8E6F")
    static let finiGreenSoft   = Color(hex: "#A7C9B4")
    // Data / Lavender
    static let finiLavender    = Color(hex: "#E8ECFF")
    static let finiLavenderDeep = Color(hex: "#D4DBFA")
    static let finiBlue        = Color(hex: "#5A6FB8")
    static let finiBlueSoft    = Color(hex: "#A5B0D8")
    // Finance
    static let finiIncome      = Color(hex: "#5B8E6F")
    static let finiIncomeTint  = Color(hex: "#DDEEDF")
    static let finiExpense     = Color(hex: "#D47070")
    static let finiExpenseTint = Color(hex: "#FADEDC")
    static let finiGold        = Color(hex: "#C9A24D")
    static let finiGoldTint    = Color(hex: "#F3E7C7")
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default: (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(.sRGB, red: Double(r)/255, green: Double(g)/255, blue: Double(b)/255, opacity: Double(a)/255)
    }
}

extension Font {
    static func rubik(_ size: CGFloat, weight: Font.Weight = .regular) -> Font {
        return .system(size: size, weight: weight, design: .default)
    }
}

struct FiniTokens {
    static let radiusSm: CGFloat = 10
    static let radiusMd: CGFloat = 16
    static let radiusLg: CGFloat = 22
    static let radiusXl: CGFloat = 28
}
