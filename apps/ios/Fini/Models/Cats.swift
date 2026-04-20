import SwiftUI

struct CatDef {
    let label: String
    let icon: String
    let tint: Color
    let ink: Color
}

let CATS: [String: CatDef] = [
    "food":      CatDef(label: "מסעדות", icon: "coffee",  tint: Color(hex: "#FCE6D4"), ink: Color(hex: "#B5662E")),
    "grocery":   CatDef(label: "סופר",   icon: "cart",    tint: Color(hex: "#E3EEDB"), ink: Color(hex: "#5E8040")),
    "rent":      CatDef(label: "שכירות", icon: "home",    tint: Color(hex: "#E5E2F5"), ink: Color(hex: "#5A4E9A")),
    "transport": CatDef(label: "תחבורה", icon: "car",     tint: Color(hex: "#DCE9F2"), ink: Color(hex: "#4A7390")),
    "utility":   CatDef(label: "חשבונות",icon: "bolt",    tint: Color(hex: "#F6E6C1"), ink: Color(hex: "#9B7C2E")),
    "salary":    CatDef(label: "משכורת", icon: "wallet",  tint: Color(hex: "#DDEEDF"), ink: Color(hex: "#3E7354")),
    "gift":      CatDef(label: "מתנות",  icon: "gift",    tint: Color(hex: "#F9DEE8"), ink: Color(hex: "#A3446A")),
    "phone":     CatDef(label: "סלולר",  icon: "phone",   tint: Color(hex: "#E4E9FA"), ink: Color(hex: "#4A5BA4")),
    "fun":       CatDef(label: "בילויים",icon: "heart",   tint: Color(hex: "#FCE1EC"), ink: Color(hex: "#AF4775")),
    "save":      CatDef(label: "חיסכון", icon: "piggy",   tint: Color(hex: "#F3E7C7"), ink: Color(hex: "#8A6E2C")),
]
