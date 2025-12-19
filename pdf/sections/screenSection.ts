// pdf/sections/screenSection.ts

export function buildScreenSection(screen: {
  pixelPitch: number;
  widthMeters: number;
  heightMeters: number;
  aspectRatio: string;
}) {
  return [
    {
      text: "Screen / Hardware",
      style: "sectionHeader",
      margin: [0, 0, 0, 6],
    },
    {
      table: {
        widths: ["25%", "60%"],
        body: [
          [
            {
              text: "Pixel Pitch:",
              style: "tableLabel",
              alignment: "right",
              margin: [0, 0, 6, 0],
              fillColor: "#F3F3F3",
            },
            {
              text: `${screen.pixelPitch} mm`,
              style: "tableValue",
            },
          ],
          [
            {
              text: "Width:",
              style: "tableLabel",
              alignment: "right",
              margin: [0, 0, 6, 0],
              fillColor: "#F3F3F3",
            },
            {
              text: `${screen.widthMeters} m`,
              style: "tableValue",
            },
          ],
          [
            {
              text: "Height:",
              style: "tableLabel",
              alignment: "right",
              margin: [0, 0, 6, 0],
              fillColor: "#F3F3F3",
            },
            {
              text: `${screen.heightMeters} m`,
              style: "tableValue",
            },
          ],
          [
            {
              text: "Aspect Ratio:",
              style: "tableLabel",
              alignment: "right",
              margin: [0, 0, 6, 0],
              fillColor: "#F3F3F3",
            },
            {
              text: screen.aspectRatio,
              style: "tableValue",
            },
          ],
        ],
      },
      layout: {
        paddingLeft: (col: number) => (col === 0 ? 0 : 10),
        paddingRight: (_col: number) => 6,
        paddingTop: (_row: number) => 4,
        paddingBottom: (_row: number) => 4,
        vLineWidth: (i: number) => (i === 1 ? 1 : 0.5),
        hLineWidth: (_i: number) => 0.5,
        vLineColor: () => "#CCCCCC",
        hLineColor: () => "#DDDDDD",
      },
    },
  ];
}
