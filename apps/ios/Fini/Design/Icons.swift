import SwiftUI

struct FiniIcon: View {
    let name: String
    var size: CGFloat = 24
    var color: Color = .finiInk

    var body: some View {
        Canvas { context, _ in
            let s = size / 24
            let sw = StrokeStyle(lineWidth: 1.6, lineCap: .round, lineJoin: .round)

            switch name {

            case "arrow":
                var p = Path()
                p.move(to: CGPoint(x: 5*s, y: 12*s))
                p.addLine(to: CGPoint(x: 19*s, y: 12*s))
                p.move(to: CGPoint(x: 13*s, y: 6*s))
                p.addLine(to: CGPoint(x: 19*s, y: 12*s))
                p.addLine(to: CGPoint(x: 13*s, y: 18*s))
                context.stroke(p, with: .color(color), style: sw)

            case "arrowL":
                var p = Path()
                p.move(to: CGPoint(x: 19*s, y: 12*s))
                p.addLine(to: CGPoint(x: 5*s, y: 12*s))
                p.move(to: CGPoint(x: 11*s, y: 6*s))
                p.addLine(to: CGPoint(x: 5*s, y: 12*s))
                p.addLine(to: CGPoint(x: 11*s, y: 18*s))
                context.stroke(p, with: .color(color), style: sw)

            case "chat":
                var p = Path()
                p.addRoundedRect(in: CGRect(x: 3*s, y: 3*s, width: 18*s, height: 14*s), cornerSize: CGSize(width: 4*s, height: 4*s))
                p.move(to: CGPoint(x: 8*s, y: 17*s))
                p.addLine(to: CGPoint(x: 6*s, y: 21*s))
                p.addLine(to: CGPoint(x: 12*s, y: 17*s))
                context.stroke(p, with: .color(color), style: sw)

            case "insights":
                var p = Path()
                // bar chart
                p.move(to: CGPoint(x: 4*s, y: 20*s))
                p.addLine(to: CGPoint(x: 4*s, y: 14*s))
                p.move(to: CGPoint(x: 9*s, y: 20*s))
                p.addLine(to: CGPoint(x: 9*s, y: 8*s))
                p.move(to: CGPoint(x: 14*s, y: 20*s))
                p.addLine(to: CGPoint(x: 14*s, y: 12*s))
                p.move(to: CGPoint(x: 19*s, y: 20*s))
                p.addLine(to: CGPoint(x: 19*s, y: 4*s))
                p.move(to: CGPoint(x: 2*s, y: 20*s))
                p.addLine(to: CGPoint(x: 22*s, y: 20*s))
                context.stroke(p, with: .color(color), style: sw)

            case "data":
                var p = Path()
                p.addEllipse(in: CGRect(x: 3*s, y: 3*s, width: 18*s, height: 18*s))
                p.move(to: CGPoint(x: 12*s, y: 3*s))
                p.addLine(to: CGPoint(x: 12*s, y: 12*s))
                p.addLine(to: CGPoint(x: 18*s, y: 17*s))
                context.stroke(p, with: .color(color), style: sw)

            case "add":
                var p = Path()
                p.addRoundedRect(in: CGRect(x: 3*s, y: 3*s, width: 18*s, height: 18*s), cornerSize: CGSize(width: 5*s, height: 5*s))
                p.move(to: CGPoint(x: 12*s, y: 8*s))
                p.addLine(to: CGPoint(x: 12*s, y: 16*s))
                p.move(to: CGPoint(x: 8*s, y: 12*s))
                p.addLine(to: CGPoint(x: 16*s, y: 12*s))
                context.stroke(p, with: .color(color), style: sw)

            case "camera":
                var p = Path()
                p.addRoundedRect(in: CGRect(x: 2*s, y: 6*s, width: 20*s, height: 14*s), cornerSize: CGSize(width: 3*s, height: 3*s))
                p.addEllipse(in: CGRect(x: 8*s, y: 9*s, width: 8*s, height: 8*s))
                p.move(to: CGPoint(x: 16*s, y: 6*s))
                p.addLine(to: CGPoint(x: 18*s, y: 4*s))
                context.stroke(p, with: .color(color), style: sw)

            case "mic":
                var p = Path()
                // mic body
                p.addRoundedRect(in: CGRect(x: 9*s, y: 2*s, width: 6*s, height: 11*s), cornerSize: CGSize(width: 3*s, height: 3*s))
                // arc
                p.move(to: CGPoint(x: 5*s, y: 11*s))
                p.addArc(center: CGPoint(x: 12*s, y: 11*s), radius: 7*s, startAngle: .degrees(180), endAngle: .degrees(0), clockwise: true)
                // stem
                p.move(to: CGPoint(x: 12*s, y: 18*s))
                p.addLine(to: CGPoint(x: 12*s, y: 22*s))
                p.move(to: CGPoint(x: 9*s, y: 22*s))
                p.addLine(to: CGPoint(x: 15*s, y: 22*s))
                context.stroke(p, with: .color(color), style: sw)

            case "plus":
                var p = Path()
                p.move(to: CGPoint(x: 12*s, y: 5*s))
                p.addLine(to: CGPoint(x: 12*s, y: 19*s))
                p.move(to: CGPoint(x: 5*s, y: 12*s))
                p.addLine(to: CGPoint(x: 19*s, y: 12*s))
                context.stroke(p, with: .color(color), style: sw)

            case "send":
                var p = Path()
                p.move(to: CGPoint(x: 22*s, y: 2*s))
                p.addLine(to: CGPoint(x: 11*s, y: 13*s))
                p.move(to: CGPoint(x: 22*s, y: 2*s))
                p.addLine(to: CGPoint(x: 15*s, y: 22*s))
                p.addLine(to: CGPoint(x: 11*s, y: 13*s))
                p.addLine(to: CGPoint(x: 2*s, y: 9*s))
                p.addLine(to: CGPoint(x: 22*s, y: 2*s))
                context.stroke(p, with: .color(color), style: sw)

            case "filter":
                var p = Path()
                p.move(to: CGPoint(x: 3*s, y: 6*s))
                p.addLine(to: CGPoint(x: 21*s, y: 6*s))
                p.move(to: CGPoint(x: 6*s, y: 12*s))
                p.addLine(to: CGPoint(x: 18*s, y: 12*s))
                p.move(to: CGPoint(x: 9*s, y: 18*s))
                p.addLine(to: CGPoint(x: 15*s, y: 18*s))
                context.stroke(p, with: .color(color), style: sw)

            case "search":
                var p = Path()
                p.addEllipse(in: CGRect(x: 3*s, y: 3*s, width: 13*s, height: 13*s))
                p.move(to: CGPoint(x: 14*s, y: 14*s))
                p.addLine(to: CGPoint(x: 21*s, y: 21*s))
                context.stroke(p, with: .color(color), style: sw)

            case "bell":
                var p = Path()
                p.move(to: CGPoint(x: 12*s, y: 2*s))
                p.addArc(center: CGPoint(x: 12*s, y: 10*s), radius: 8*s, startAngle: .degrees(-90), endAngle: .degrees(0), clockwise: false)
                p.addLine(to: CGPoint(x: 20*s, y: 17*s))
                p.addLine(to: CGPoint(x: 4*s, y: 17*s))
                p.addLine(to: CGPoint(x: 4*s, y: 10*s))
                p.addArc(center: CGPoint(x: 12*s, y: 10*s), radius: 8*s, startAngle: .degrees(180), endAngle: .degrees(-90), clockwise: false)
                p.move(to: CGPoint(x: 10*s, y: 17*s))
                p.addArc(center: CGPoint(x: 12*s, y: 17*s), radius: 2*s, startAngle: .degrees(180), endAngle: .degrees(0), clockwise: true)
                context.stroke(p, with: .color(color), style: sw)

            case "wallet":
                var p = Path()
                p.addRoundedRect(in: CGRect(x: 2*s, y: 6*s, width: 20*s, height: 14*s), cornerSize: CGSize(width: 3*s, height: 3*s))
                p.move(to: CGPoint(x: 2*s, y: 10*s))
                p.addLine(to: CGPoint(x: 22*s, y: 10*s))
                p.addEllipse(in: CGRect(x: 15*s, y: 13*s, width: 3*s, height: 3*s))
                context.stroke(p, with: .color(color), style: sw)

            case "target":
                var p = Path()
                p.addEllipse(in: CGRect(x: 2*s, y: 2*s, width: 20*s, height: 20*s))
                p.addEllipse(in: CGRect(x: 7*s, y: 7*s, width: 10*s, height: 10*s))
                p.addEllipse(in: CGRect(x: 11*s, y: 11*s, width: 2*s, height: 2*s))
                context.stroke(p, with: .color(color), style: sw)

            case "sparkle":
                var p = Path()
                p.move(to: CGPoint(x: 12*s, y: 2*s))
                p.addLine(to: CGPoint(x: 12*s, y: 8*s))
                p.move(to: CGPoint(x: 12*s, y: 16*s))
                p.addLine(to: CGPoint(x: 12*s, y: 22*s))
                p.move(to: CGPoint(x: 2*s, y: 12*s))
                p.addLine(to: CGPoint(x: 8*s, y: 12*s))
                p.move(to: CGPoint(x: 16*s, y: 12*s))
                p.addLine(to: CGPoint(x: 22*s, y: 12*s))
                p.move(to: CGPoint(x: 4.9*s, y: 4.9*s))
                p.addLine(to: CGPoint(x: 8.8*s, y: 8.8*s))
                p.move(to: CGPoint(x: 15.2*s, y: 15.2*s))
                p.addLine(to: CGPoint(x: 19.1*s, y: 19.1*s))
                p.move(to: CGPoint(x: 19.1*s, y: 4.9*s))
                p.addLine(to: CGPoint(x: 15.2*s, y: 8.8*s))
                p.move(to: CGPoint(x: 8.8*s, y: 15.2*s))
                p.addLine(to: CGPoint(x: 4.9*s, y: 19.1*s))
                context.stroke(p, with: .color(color), style: sw)

            case "receipt":
                var p = Path()
                p.move(to: CGPoint(x: 5*s, y: 2*s))
                p.addLine(to: CGPoint(x: 19*s, y: 2*s))
                p.addLine(to: CGPoint(x: 19*s, y: 22*s))
                p.addLine(to: CGPoint(x: 16*s, y: 20*s))
                p.addLine(to: CGPoint(x: 13*s, y: 22*s))
                p.addLine(to: CGPoint(x: 10*s, y: 20*s))
                p.addLine(to: CGPoint(x: 7*s, y: 22*s))
                p.addLine(to: CGPoint(x: 5*s, y: 22*s))
                p.addLine(to: CGPoint(x: 5*s, y: 2*s))
                p.move(to: CGPoint(x: 9*s, y: 8*s))
                p.addLine(to: CGPoint(x: 15*s, y: 8*s))
                p.move(to: CGPoint(x: 9*s, y: 12*s))
                p.addLine(to: CGPoint(x: 15*s, y: 12*s))
                context.stroke(p, with: .color(color), style: sw)

            case "heart":
                var p = Path()
                p.move(to: CGPoint(x: 12*s, y: 20*s))
                p.addCurve(to: CGPoint(x: 12*s, y: 20*s),
                           control1: CGPoint(x: 2*s, y: 14*s),
                           control2: CGPoint(x: 2*s, y: 7*s))
                var p2 = Path()
                p2.move(to: CGPoint(x: 12*s, y: 7*s))
                p2.addArc(center: CGPoint(x: 7.5*s, y: 7*s), radius: 4.5*s, startAngle: .degrees(0), endAngle: .degrees(180), clockwise: false)
                p2.addLine(to: CGPoint(x: 3*s, y: 7*s))
                p2.addCurve(to: CGPoint(x: 12*s, y: 20*s), control1: CGPoint(x: 3*s, y: 14*s), control2: CGPoint(x: 7*s, y: 18*s))
                p2.addCurve(to: CGPoint(x: 21*s, y: 7*s), control1: CGPoint(x: 17*s, y: 18*s), control2: CGPoint(x: 21*s, y: 14*s))
                p2.addArc(center: CGPoint(x: 16.5*s, y: 7*s), radius: 4.5*s, startAngle: .degrees(0), endAngle: .degrees(180), clockwise: true)
                p2.addLine(to: CGPoint(x: 12*s, y: 7*s))
                context.stroke(p2, with: .color(color), style: sw)

            case "home":
                var p = Path()
                p.move(to: CGPoint(x: 3*s, y: 11*s))
                p.addLine(to: CGPoint(x: 12*s, y: 3*s))
                p.addLine(to: CGPoint(x: 21*s, y: 11*s))
                p.addLine(to: CGPoint(x: 21*s, y: 21*s))
                p.addLine(to: CGPoint(x: 15*s, y: 21*s))
                p.addLine(to: CGPoint(x: 15*s, y: 15*s))
                p.addLine(to: CGPoint(x: 9*s, y: 15*s))
                p.addLine(to: CGPoint(x: 9*s, y: 21*s))
                p.addLine(to: CGPoint(x: 3*s, y: 21*s))
                p.addLine(to: CGPoint(x: 3*s, y: 11*s))
                context.stroke(p, with: .color(color), style: sw)

            case "coffee":
                var p = Path()
                p.addRoundedRect(in: CGRect(x: 3*s, y: 9*s, width: 14*s, height: 11*s), cornerSize: CGSize(width: 2*s, height: 2*s))
                p.move(to: CGPoint(x: 17*s, y: 12*s))
                p.addArc(center: CGPoint(x: 19*s, y: 14*s), radius: 2*s, startAngle: .degrees(270), endAngle: .degrees(90), clockwise: false)
                p.addLine(to: CGPoint(x: 17*s, y: 16*s))
                p.move(to: CGPoint(x: 7*s, y: 9*s))
                p.addLine(to: CGPoint(x: 7*s, y: 6*s))
                p.move(to: CGPoint(x: 10*s, y: 9*s))
                p.addLine(to: CGPoint(x: 10*s, y: 5*s))
                p.move(to: CGPoint(x: 13*s, y: 9*s))
                p.addLine(to: CGPoint(x: 13*s, y: 7*s))
                context.stroke(p, with: .color(color), style: sw)

            case "cart":
                var p = Path()
                p.move(to: CGPoint(x: 1*s, y: 2*s))
                p.addLine(to: CGPoint(x: 4*s, y: 2*s))
                p.addLine(to: CGPoint(x: 7*s, y: 16*s))
                p.addLine(to: CGPoint(x: 20*s, y: 16*s))
                p.addLine(to: CGPoint(x: 22*s, y: 6*s))
                p.addLine(to: CGPoint(x: 6*s, y: 6*s))
                p.addEllipse(in: CGRect(x: 8*s, y: 18*s, width: 2.5*s, height: 2.5*s))
                p.addEllipse(in: CGRect(x: 16*s, y: 18*s, width: 2.5*s, height: 2.5*s))
                context.stroke(p, with: .color(color), style: sw)

            case "car":
                var p = Path()
                p.move(to: CGPoint(x: 3*s, y: 13*s))
                p.addLine(to: CGPoint(x: 5*s, y: 7*s))
                p.addLine(to: CGPoint(x: 19*s, y: 7*s))
                p.addLine(to: CGPoint(x: 21*s, y: 13*s))
                p.addLine(to: CGPoint(x: 21*s, y: 17*s))
                p.addLine(to: CGPoint(x: 3*s, y: 17*s))
                p.addLine(to: CGPoint(x: 3*s, y: 13*s))
                p.addEllipse(in: CGRect(x: 5.5*s, y: 15.5*s, width: 3*s, height: 3*s))
                p.addEllipse(in: CGRect(x: 15.5*s, y: 15.5*s, width: 3*s, height: 3*s))
                p.move(to: CGPoint(x: 3*s, y: 13*s))
                p.addLine(to: CGPoint(x: 21*s, y: 13*s))
                context.stroke(p, with: .color(color), style: sw)

            case "bolt":
                var p = Path()
                p.move(to: CGPoint(x: 13*s, y: 2*s))
                p.addLine(to: CGPoint(x: 4*s, y: 14*s))
                p.addLine(to: CGPoint(x: 11*s, y: 14*s))
                p.addLine(to: CGPoint(x: 11*s, y: 22*s))
                p.addLine(to: CGPoint(x: 20*s, y: 10*s))
                p.addLine(to: CGPoint(x: 13*s, y: 10*s))
                p.addLine(to: CGPoint(x: 13*s, y: 2*s))
                context.stroke(p, with: .color(color), style: sw)

            case "gift":
                var p = Path()
                p.addRoundedRect(in: CGRect(x: 3*s, y: 9*s, width: 18*s, height: 13*s), cornerSize: CGSize(width: 2*s, height: 2*s))
                p.addRoundedRect(in: CGRect(x: 2*s, y: 6*s, width: 20*s, height: 4*s), cornerSize: CGSize(width: 1*s, height: 1*s))
                p.move(to: CGPoint(x: 12*s, y: 6*s))
                p.addLine(to: CGPoint(x: 12*s, y: 22*s))
                p.move(to: CGPoint(x: 12*s, y: 6*s))
                p.addArc(center: CGPoint(x: 9.5*s, y: 5*s), radius: 2.5*s, startAngle: .degrees(0), endAngle: .degrees(-180), clockwise: true)
                p.move(to: CGPoint(x: 12*s, y: 6*s))
                p.addArc(center: CGPoint(x: 14.5*s, y: 5*s), radius: 2.5*s, startAngle: .degrees(180), endAngle: .degrees(0), clockwise: true)
                context.stroke(p, with: .color(color), style: sw)

            case "phone":
                var p = Path()
                p.move(to: CGPoint(x: 16*s, y: 3*s))
                p.addCurve(to: CGPoint(x: 21*s, y: 8*s),
                           control1: CGPoint(x: 16*s, y: 3*s),
                           control2: CGPoint(x: 21*s, y: 3*s))
                p.move(to: CGPoint(x: 16*s, y: 3*s))
                p.addLine(to: CGPoint(x: 14*s, y: 5*s))
                p.addLine(to: CGPoint(x: 19*s, y: 10*s))
                p.addLine(to: CGPoint(x: 21*s, y: 8*s))
                let phoneBody = Path(roundedRect: CGRect(x: 3*s, y: 3*s, width: 9*s, height: 18*s), cornerRadius: 2*s)
                var p2 = Path()
                p2.addPath(phoneBody)
                p2.move(to: CGPoint(x: 3*s, y: 11.5*s))
                p2.addArc(center: CGPoint(x: 5*s, y: 11.5*s), radius: 2*s, startAngle: .degrees(180), endAngle: .degrees(0), clockwise: false)
                p2.addLine(to: CGPoint(x: 9*s, y: 11.5*s))
                p2.addLine(to: CGPoint(x: 14*s, y: 6.5*s))
                p2.addLine(to: CGPoint(x: 16*s, y: 8.5*s))
                p2.addLine(to: CGPoint(x: 11*s, y: 13.5*s))
                // simpler phone icon
                var ph = Path()
                ph.move(to: CGPoint(x: 22*s, y: 16.92*s))
                ph.addCurve(to: CGPoint(x: 16.32*s, y: 15*s),
                             control1: CGPoint(x: 20.39*s, y: 17.29*s),
                             control2: CGPoint(x: 18*s, y: 16.14*s))
                ph.addLine(to: CGPoint(x: 14.18*s, y: 17.14*s))
                ph.addCurve(to: CGPoint(x: 6.86*s, y: 9.82*s),
                             control1: CGPoint(x: 11.75*s, y: 15.25*s),
                             control2: CGPoint(x: 8.75*s, y: 12.25*s))
                ph.addLine(to: CGPoint(x: 9*s, y: 7.68*s))
                ph.addCurve(to: CGPoint(x: 7.08*s, y: 2*s),
                             control1: CGPoint(x: 7.86*s, y: 6*s),
                             control2: CGPoint(x: 6.71*s, y: 3.61*s))
                ph.addLine(to: CGPoint(x: 4*s, y: 2*s))
                ph.addCurve(to: CGPoint(x: 22*s, y: 16.92*s),
                             control1: CGPoint(x: 4*s, y: 8.5*s),
                             control2: CGPoint(x: 12*s, y: 20*s))
                context.stroke(ph, with: .color(color), style: sw)
                return

            case "lock":
                var p = Path()
                p.addRoundedRect(in: CGRect(x: 4*s, y: 11*s, width: 16*s, height: 11*s), cornerSize: CGSize(width: 2*s, height: 2*s))
                p.move(to: CGPoint(x: 8*s, y: 11*s))
                p.addArc(center: CGPoint(x: 12*s, y: 8*s), radius: 4*s, startAngle: .degrees(180), endAngle: .degrees(0), clockwise: true)
                p.addLine(to: CGPoint(x: 16*s, y: 11*s))
                p.addEllipse(in: CGRect(x: 11*s, y: 15*s, width: 2*s, height: 2*s))
                context.stroke(p, with: .color(color), style: sw)

            case "check":
                var p = Path()
                p.move(to: CGPoint(x: 20*s, y: 6*s))
                p.addLine(to: CGPoint(x: 9*s, y: 17*s))
                p.addLine(to: CGPoint(x: 4*s, y: 12*s))
                context.stroke(p, with: .color(color), style: sw)

            case "close":
                var p = Path()
                p.move(to: CGPoint(x: 18*s, y: 6*s))
                p.addLine(to: CGPoint(x: 6*s, y: 18*s))
                p.move(to: CGPoint(x: 6*s, y: 6*s))
                p.addLine(to: CGPoint(x: 18*s, y: 18*s))
                context.stroke(p, with: .color(color), style: sw)

            case "dots":
                for cx in [6, 12, 18] as [CGFloat] {
                    var p = Path()
                    p.addEllipse(in: CGRect(x: (cx-1.2)*s, y: 10.8*s, width: 2.4*s, height: 2.4*s))
                    context.fill(p, with: .color(color))
                }

            case "calendar":
                var p = Path()
                p.addRoundedRect(in: CGRect(x: 3*s, y: 4*s, width: 18*s, height: 18*s), cornerSize: CGSize(width: 2*s, height: 2*s))
                p.move(to: CGPoint(x: 3*s, y: 10*s))
                p.addLine(to: CGPoint(x: 21*s, y: 10*s))
                p.move(to: CGPoint(x: 8*s, y: 4*s))
                p.addLine(to: CGPoint(x: 8*s, y: 2*s))
                p.move(to: CGPoint(x: 16*s, y: 4*s))
                p.addLine(to: CGPoint(x: 16*s, y: 2*s))
                context.stroke(p, with: .color(color), style: sw)

            case "trend":
                var p = Path()
                p.move(to: CGPoint(x: 22*s, y: 7*s))
                p.addLine(to: CGPoint(x: 14*s, y: 15*s))
                p.addLine(to: CGPoint(x: 10*s, y: 11*s))
                p.addLine(to: CGPoint(x: 2*s, y: 19*s))
                p.move(to: CGPoint(x: 16*s, y: 7*s))
                p.addLine(to: CGPoint(x: 22*s, y: 7*s))
                p.addLine(to: CGPoint(x: 22*s, y: 13*s))
                context.stroke(p, with: .color(color), style: sw)

            case "piggy":
                var p = Path()
                // body
                p.addEllipse(in: CGRect(x: 4*s, y: 7*s, width: 13*s, height: 12*s))
                // snout
                p.addEllipse(in: CGRect(x: 14*s, y: 11*s, width: 5*s, height: 4*s))
                // ear
                p.addRoundedRect(in: CGRect(x: 7*s, y: 4*s, width: 4*s, height: 4*s), cornerSize: CGSize(width: 1.5*s, height: 1.5*s))
                // eye
                p.addEllipse(in: CGRect(x: 9*s, y: 9.5*s, width: 1.5*s, height: 1.5*s))
                // legs
                p.move(to: CGPoint(x: 7*s, y: 19*s))
                p.addLine(to: CGPoint(x: 7*s, y: 22*s))
                p.move(to: CGPoint(x: 11*s, y: 19*s))
                p.addLine(to: CGPoint(x: 11*s, y: 22*s))
                // coin slot
                p.move(to: CGPoint(x: 10*s, y: 7*s))
                p.addLine(to: CGPoint(x: 13*s, y: 7*s))
                context.stroke(p, with: .color(color), style: sw)

            case "users":
                var p = Path()
                p.addEllipse(in: CGRect(x: 1*s, y: 3*s, width: 8*s, height: 8*s))
                p.move(to: CGPoint(x: 1*s, y: 22*s))
                p.addArc(center: CGPoint(x: 5*s, y: 17*s), radius: 5*s, startAngle: .degrees(180), endAngle: .degrees(0), clockwise: true)
                p.addEllipse(in: CGRect(x: 15*s, y: 3*s, width: 8*s, height: 8*s))
                p.move(to: CGPoint(x: 14*s, y: 22*s))
                p.addArc(center: CGPoint(x: 19*s, y: 17*s), radius: 5*s, startAngle: .degrees(180), endAngle: .degrees(0), clockwise: true)
                context.stroke(p, with: .color(color), style: sw)

            case "tag":
                var p = Path()
                p.move(to: CGPoint(x: 20.59*s, y: 13.41*s))
                p.addLine(to: CGPoint(x: 11.5*s, y: 22.5*s))
                p.addArc(center: CGPoint(x: 10.5*s, y: 21.5*s), radius: 1.4*s, startAngle: .degrees(45), endAngle: .degrees(225), clockwise: false)
                p.move(to: CGPoint(x: 20.59*s, y: 13.41*s))
                p.addCurve(to: CGPoint(x: 3*s, y: 3*s),
                           control1: CGPoint(x: 22*s, y: 12*s),
                           control2: CGPoint(x: 22*s, y: 3*s))
                p.addLine(to: CGPoint(x: 3*s, y: 12*s))
                p.addLine(to: CGPoint(x: 10.59*s, y: 19.59*s))
                p.addEllipse(in: CGRect(x: 6.5*s, y: 6.5*s, width: 3*s, height: 3*s))
                context.stroke(p, with: .color(color), style: sw)

            case "apple":
                var p = Path()
                p.move(to: CGPoint(x: 18.71*s, y: 8.66*s))
                p.addCurve(to: CGPoint(x: 14.5*s, y: 6*s),
                           control1: CGPoint(x: 18.71*s, y: 7.33*s),
                           control2: CGPoint(x: 16.88*s, y: 6*s))
                p.addCurve(to: CGPoint(x: 12*s, y: 7*s),
                           control1: CGPoint(x: 13.19*s, y: 6*s),
                           control2: CGPoint(x: 12.69*s, y: 6.5*s))
                p.addCurve(to: CGPoint(x: 9.5*s, y: 6*s),
                           control1: CGPoint(x: 11.31*s, y: 6.5*s),
                           control2: CGPoint(x: 10.81*s, y: 6*s))
                p.addCurve(to: CGPoint(x: 5.29*s, y: 8.66*s),
                           control1: CGPoint(x: 7.12*s, y: 6*s),
                           control2: CGPoint(x: 5.29*s, y: 7.33*s))
                p.addCurve(to: CGPoint(x: 6.5*s, y: 14.64*s),
                           control1: CGPoint(x: 5.29*s, y: 10.64*s),
                           control2: CGPoint(x: 5.83*s, y: 12.7*s))
                p.addCurve(to: CGPoint(x: 9.5*s, y: 18*s),
                           control1: CGPoint(x: 7.17*s, y: 16.58*s),
                           control2: CGPoint(x: 8.21*s, y: 18*s))
                p.addCurve(to: CGPoint(x: 12*s, y: 17*s),
                           control1: CGPoint(x: 10.5*s, y: 18*s),
                           control2: CGPoint(x: 11.12*s, y: 17*s))
                p.addCurve(to: CGPoint(x: 14.5*s, y: 18*s),
                           control1: CGPoint(x: 12.88*s, y: 17*s),
                           control2: CGPoint(x: 13.5*s, y: 18*s))
                p.addCurve(to: CGPoint(x: 17.5*s, y: 14.64*s),
                           control1: CGPoint(x: 15.79*s, y: 18*s),
                           control2: CGPoint(x: 16.83*s, y: 16.58*s))
                p.addCurve(to: CGPoint(x: 18.71*s, y: 8.66*s),
                           control1: CGPoint(x: 18.17*s, y: 12.7*s),
                           control2: CGPoint(x: 18.71*s, y: 10.64*s))
                // leaf
                p.move(to: CGPoint(x: 12*s, y: 7*s))
                p.addCurve(to: CGPoint(x: 14*s, y: 4*s),
                           control1: CGPoint(x: 12*s, y: 5.5*s),
                           control2: CGPoint(x: 13*s, y: 4*s))
                p.addLine(to: CGPoint(x: 14*s, y: 3*s))
                p.addCurve(to: CGPoint(x: 12*s, y: 5*s),
                           control1: CGPoint(x: 13*s, y: 3*s),
                           control2: CGPoint(x: 12*s, y: 4*s))
                context.stroke(p, with: .color(color), style: sw)

            case "google":
                var p = Path()
                p.move(to: CGPoint(x: 21.8*s, y: 10.3*s))
                p.addLine(to: CGPoint(x: 12*s, y: 10.3*s))
                p.addLine(to: CGPoint(x: 12*s, y: 13.5*s))
                p.addLine(to: CGPoint(x: 17.7*s, y: 13.5*s))
                p.addCurve(to: CGPoint(x: 12*s, y: 18.5*s),
                           control1: CGPoint(x: 17*s, y: 16.5*s),
                           control2: CGPoint(x: 14.7*s, y: 18.5*s))
                p.addArc(center: CGPoint(x: 12*s, y: 12*s), radius: 6.5*s, startAngle: .degrees(90), endAngle: .degrees(-180), clockwise: false)
                p.move(to: CGPoint(x: 5.5*s, y: 7.2*s))
                p.addArc(center: CGPoint(x: 12*s, y: 12*s), radius: 6.5*s, startAngle: .degrees(210), endAngle: .degrees(150), clockwise: false)
                context.stroke(p, with: .color(color), style: sw)

            default:
                // fallback: circle with X
                var p = Path()
                p.addEllipse(in: CGRect(x: 3*s, y: 3*s, width: 18*s, height: 18*s))
                context.stroke(p, with: .color(color), style: sw)
            }
        }
        .frame(width: size, height: size)
    }
}
