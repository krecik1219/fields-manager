-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 22 Mar 2018, 21:33
-- Wersja serwera: 10.1.30-MariaDB
-- Wersja PHP: 7.2.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `fields_base`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `colors`
--

CREATE TABLE `colors` (
  `id_color` int(11) NOT NULL,
  `color_hex_code` varchar(15) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `colors`
--

INSERT INTO `colors` (`id_color`, `color_hex_code`) VALUES
(2, '#000000'),
(5, '#0000ff'),
(4, '#00ff00'),
(3, '#ff0000'),
(6, '#ffff00');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `coordinates`
--

CREATE TABLE `coordinates` (
  `id_coor` int(11) NOT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `coordinates`
--

INSERT INTO `coordinates` (`id_coor`, `lat`, `lng`) VALUES
(1, 1.1, 1.1),
(2, 1.5, 1.1),
(3, 1.2, 1.2),
(4, 2, 2.1),
(5, 2.3, 2),
(6, 2.25, 2.15);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `fields`
--

CREATE TABLE `fields` (
  `id_field` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_place` int(11) DEFAULT NULL,
  `area` double NOT NULL DEFAULT '0',
  `id_color` int(11) DEFAULT NULL,
  `description` text COLLATE utf8_polish_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `fields`
--

INSERT INTO `fields` (`id_field`, `id_user`, `id_place`, `area`, `id_color`, `description`) VALUES
(1, 1, 1, 0, 6, 'Pole testowe dodane do bazy danych'),
(2, 1, 5, 0, 5, 'Jakiś testowy opisik.');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `located`
--

CREATE TABLE `located` (
  `id_field` int(11) NOT NULL,
  `id_coor` int(11) NOT NULL,
  `number` int(11) NOT NULL COMMENT 'help to determine correct order in polygon drawing'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `located`
--

INSERT INTO `located` (`id_field`, `id_coor`, `number`) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 3),
(2, 4, 1),
(2, 5, 2),
(2, 6, 3);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `places`
--

CREATE TABLE `places` (
  `id_place` int(11) NOT NULL,
  `place_name` varchar(30) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `places`
--

INSERT INTO `places` (`id_place`, `place_name`) VALUES
(1, 'Głubczyce'),
(2, 'Wodzisław Śląski'),
(3, 'Racibórz'),
(4, 'Gołuszowice'),
(5, 'Nowe Gołuszowice');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `planted`
--

CREATE TABLE `planted` (
  `id_field` int(11) NOT NULL,
  `id_plant` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `planted`
--

INSERT INTO `planted` (`id_field`, `id_plant`) VALUES
(1, 2),
(2, 6);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `plants`
--

CREATE TABLE `plants` (
  `id_plant` int(11) NOT NULL,
  `plant_name` varchar(30) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `plants`
--

INSERT INTO `plants` (`id_plant`, `plant_name`) VALUES
(2, 'jęczmień'),
(1, 'kukurydza'),
(5, 'pszenica'),
(3, 'ziemniaki'),
(6, 'żyto');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id_u` int(11) NOT NULL,
  `login` varchar(30) COLLATE utf8_polish_ci NOT NULL,
  `email` varchar(50) COLLATE utf8_polish_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`id_u`, `login`, `email`, `password`) VALUES
(1, 'anon', 'anonek123@sample.com', '$2y$10$PmKi3yYroCoIQEpAdb4sKeGoJz1dzPQEJceJGBq31YhBmaKUdzQai'),
(2, 'anon2', 'anon2@sample.com', '$2y$10$R7L2s9Io2KjemtvOMuyX9eaThT9dPNXEbAMkeqhtrOg7FNzWePvvC');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `colors`
--
ALTER TABLE `colors`
  ADD PRIMARY KEY (`id_color`),
  ADD UNIQUE KEY `color_hex_code` (`color_hex_code`);

--
-- Indeksy dla tabeli `coordinates`
--
ALTER TABLE `coordinates`
  ADD PRIMARY KEY (`id_coor`);

--
-- Indeksy dla tabeli `fields`
--
ALTER TABLE `fields`
  ADD PRIMARY KEY (`id_field`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_place` (`id_place`),
  ADD KEY `id_color` (`id_color`);

--
-- Indeksy dla tabeli `located`
--
ALTER TABLE `located`
  ADD PRIMARY KEY (`id_field`,`id_coor`),
  ADD KEY `id_coor` (`id_coor`);

--
-- Indeksy dla tabeli `places`
--
ALTER TABLE `places`
  ADD PRIMARY KEY (`id_place`);

--
-- Indeksy dla tabeli `planted`
--
ALTER TABLE `planted`
  ADD PRIMARY KEY (`id_field`,`id_plant`),
  ADD KEY `id_plant` (`id_plant`);

--
-- Indeksy dla tabeli `plants`
--
ALTER TABLE `plants`
  ADD PRIMARY KEY (`id_plant`),
  ADD UNIQUE KEY `plant_name` (`plant_name`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_u`),
  ADD UNIQUE KEY `login` (`login`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT dla tabeli `colors`
--
ALTER TABLE `colors`
  MODIFY `id_color` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT dla tabeli `coordinates`
--
ALTER TABLE `coordinates`
  MODIFY `id_coor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT dla tabeli `fields`
--
ALTER TABLE `fields`
  MODIFY `id_field` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT dla tabeli `places`
--
ALTER TABLE `places`
  MODIFY `id_place` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT dla tabeli `plants`
--
ALTER TABLE `plants`
  MODIFY `id_plant` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `id_u` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `fields`
--
ALTER TABLE `fields`
  ADD CONSTRAINT `fields_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_u`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fields_ibfk_2` FOREIGN KEY (`id_place`) REFERENCES `places` (`id_place`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fields_ibfk_3` FOREIGN KEY (`id_color`) REFERENCES `colors` (`id_color`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `located`
--
ALTER TABLE `located`
  ADD CONSTRAINT `located_ibfk_1` FOREIGN KEY (`id_field`) REFERENCES `fields` (`id_field`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `located_ibfk_2` FOREIGN KEY (`id_coor`) REFERENCES `coordinates` (`id_coor`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `planted`
--
ALTER TABLE `planted`
  ADD CONSTRAINT `planted_ibfk_1` FOREIGN KEY (`id_field`) REFERENCES `fields` (`id_field`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `planted_ibfk_2` FOREIGN KEY (`id_plant`) REFERENCES `plants` (`id_plant`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
