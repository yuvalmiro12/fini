import SwiftUI

struct CatIcon: View {
    let cat: String
    var size: CGFloat = 40
    var radius: CGFloat = 12

    var body: some View {
        if let def = CATS[cat] {
            RoundedRectangle(cornerRadius: radius)
                .fill(def.tint)
                .frame(width: size, height: size)
                .overlay(
                    FiniIcon(name: def.icon, size: size * 0.55, color: def.ink)
                )
        }
    }
}
