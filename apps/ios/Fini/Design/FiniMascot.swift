import SwiftUI

enum FiniMood { case happy, wink, talk, wave }

struct FiniMascot: View {
    var size: CGFloat = 96
    var mood: FiniMood = .happy
    private var s: CGFloat { size / 120 }

    var body: some View {
        ZStack {
            // Shadow
            Ellipse()
                .fill(Color.finiInk.opacity(0.08))
                .frame(width: 56*s, height: 8*s)
                .offset(y: 46*s)
            // Body with radial gradient
            Circle()
                .fill(RadialGradient(
                    colors: [Color(hex: "#F7D98A"), Color(hex: "#E8B862"), Color(hex: "#C9A24D")],
                    center: UnitPoint(x: 0.4, y: 0.35),
                    startRadius: 0,
                    endRadius: size * 0.7
                ))
                .frame(width: 88*s, height: 88*s)
            // Inner coin ring (dashed circle)
            Circle()
                .stroke(Color.white.opacity(0.35), style: StrokeStyle(lineWidth: 1.2*s, dash: [2*s, 3*s]))
                .frame(width: 76*s, height: 76*s)
            // Eye group
            MascotEyes(mood: mood, s: s)
            // Mouth
            MascotMouth(mood: mood, s: s)
            // Antenna
            MascotAntenna(s: s)
            // Wave hand
            if mood == .wave {
                Circle()
                    .fill(RadialGradient(
                        colors: [Color(hex: "#F7D98A"), Color(hex: "#C9A24D")],
                        center: .center,
                        startRadius: 0,
                        endRadius: 14*s
                    ))
                    .frame(width: 14*s, height: 14*s)
                    .offset(x: 40*s, y: -8*s)
                    .rotationEffect(.degrees(20))
            }
        }
        .frame(width: size, height: size)
    }
}

struct MascotEyes: View {
    let mood: FiniMood
    let s: CGFloat
    var body: some View {
        ZStack {
            // Left eye (may wink)
            if mood == .wink {
                Path { p in
                    p.move(to: CGPoint(x: -14*s, y: 0))
                    p.addQuadCurve(to: CGPoint(x: -9*s, y: 0), control: CGPoint(x: -11.5*s, y: -4*s))
                }
                .stroke(Color.finiInk, style: StrokeStyle(lineWidth: 1.6*s, lineCap: .round))
                .offset(x: -2*s, y: -4*s)
            } else {
                Circle()
                    .fill(Color.finiInk)
                    .frame(width: 4.4*s, height: 4.4*s)
                    .offset(x: -12*s, y: -4*s)
            }
            // Right eye always open
            Circle()
                .fill(Color.finiInk)
                .frame(width: 4.4*s, height: 4.4*s)
                .offset(x: 12*s, y: -4*s)
        }
    }
}

struct MascotMouth: View {
    let mood: FiniMood
    let s: CGFloat
    var body: some View {
        if mood == .talk {
            Ellipse()
                .fill(Color.finiInk)
                .frame(width: 8*s, height: 6*s)
                .offset(y: 12*s)
        } else {
            Path { p in
                p.move(to: CGPoint(x: -8*s, y: 10*s))
                p.addQuadCurve(to: CGPoint(x: 8*s, y: 10*s), control: CGPoint(x: 0, y: 18*s))
            }
            .stroke(Color.finiInk, style: StrokeStyle(lineWidth: 2.2*s, lineCap: .round))
        }
    }
}

struct MascotAntenna: View {
    let s: CGFloat
    var body: some View {
        ZStack {
            Path { p in
                p.move(to: CGPoint(x: 0, y: 6*s))
                p.addLine(to: CGPoint(x: 0, y: -2*s))
            }
            .stroke(Color.finiGold, style: StrokeStyle(lineWidth: 2*s, lineCap: .round))
            Path { p in
                p.move(to: CGPoint(x: 0, y: -2*s))
                p.addLine(to: CGPoint(x: -3*s, y: -7*s))
                p.move(to: CGPoint(x: 0, y: -2*s))
                p.addLine(to: CGPoint(x: 3*s, y: -7*s))
                p.move(to: CGPoint(x: 0, y: -2*s))
                p.addLine(to: CGPoint(x: 0, y: -10*s))
            }
            .stroke(Color.finiGold, style: StrokeStyle(lineWidth: 1.6*s, lineCap: .round))
            Circle()
                .fill(Color(hex: "#F7D98A"))
                .frame(width: 4*s, height: 4*s)
                .offset(y: -11*s - 44*s)
        }
        .offset(y: -44*s)
    }
}

struct FiniAvatar: View {
    var size: CGFloat = 36
    var mood: FiniMood = .happy
    var body: some View {
        ZStack {
            Circle()
                .fill(LinearGradient(
                    colors: [Color(hex: "#F7D98A"), Color(hex: "#C9A24D")],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                ))
            // Eyes
            HStack(spacing: size * 0.13) {
                Circle().fill(Color.finiInk).frame(width: size*0.11, height: size*0.11)
                Circle().fill(Color.finiInk).frame(width: size*0.11, height: size*0.11)
            }.offset(y: -size*0.06)
            // Mouth
            if mood == .talk {
                Ellipse()
                    .fill(Color.finiInk)
                    .frame(width: size*0.12, height: size*0.09)
                    .offset(y: size*0.1)
            } else {
                Path { p in
                    let w = size * 0.28
                    p.move(to: CGPoint(x: -w/2, y: 0))
                    p.addQuadCurve(to: CGPoint(x: w/2, y: 0), control: CGPoint(x: 0, y: size*0.15))
                }
                .stroke(Color.finiInk, style: StrokeStyle(lineWidth: size*0.065, lineCap: .round))
                .offset(y: size*0.1)
            }
        }
        .frame(width: size, height: size)
        .shadow(color: Color.finiGold.opacity(0.3), radius: 3, y: 2)
    }
}
