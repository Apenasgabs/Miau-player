import React, { useState, type ChangeEvent } from "react";
import { StyledHome } from "./Home.styles";

const HomePage: React.FC = () => {
  const [playlistData, setPlaylistData] = useState<Record<
    string,
    any[]
  > | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const contents = e.target?.result as string;
        parseM3U(contents);
      };

      reader.readAsText(file);
    }
  };

  const parseM3U = (data: string): void => {
    const lines = data.split("\n");

    let currentCategory: string | null = null;
    const categories: Record<string, any[]> = {};

    for (const line of lines) {
      if (line.trim() === "#EXTM3U") {
        // Início da lista de reprodução
      } else if (line.startsWith("#EXTINF:")) {
        // Informações sobre a faixa, como duração e metadados
        const extinfMatch = line.match(/#EXTINF:(-?\d+) (.+)/);
        if (extinfMatch != null) {
          const metadata = extinfMatch[2];
          // Extrair informações de tvg-name, tvg-logo e group-title, se disponíveis
          const tvgNameMatch = metadata.match(/tvg-name="([^"]+)"/);
          console.log("tvgNameMatch: ", tvgNameMatch);
          const tvgLogoMatch = metadata.match(/tvg-logo="([^"]+)"/);
          console.log("tvgLogoMatch: ", tvgLogoMatch);
          const groupTitleMatch = metadata.match(/group-title="([^"]+)"/);

          if (groupTitleMatch != null) {
            currentCategory = groupTitleMatch[1];
          } else {
            currentCategory = null;
          }
        }
      } else if (line.trim() !== "" && line.startsWith("http")) {
        // URL da mídia
        if (currentCategory != null) {
          if (!(currentCategory in categories)) {
            categories[currentCategory] = [];
          }
          categories[currentCategory].push({ "Media URL": line });
        }
      }
    }

    setPlaylistData(categories);
  };

  return (
    <StyledHome>
      <p>Home</p>

      <input type="file" onChange={handleFileChange} />

      {playlistData &&
        Object.keys(playlistData).map((category, index) => (
          <div key={index}>
            <h2>{category}</h2>
            <ul>
              {playlistData[category].map((item, itemIndex) => (
                <li key={itemIndex}>
                  <a href={item["Media URL"]}>Item {itemIndex + 1}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </StyledHome>
  );
};

export default HomePage;
