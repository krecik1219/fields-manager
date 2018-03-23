-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 23 Mar 2018, 13:27
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
(7, '#f0f0f0'),
(3, '#ff0000'),
(6, '#ffff00'),
(1, '#ffffff');

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
(6, 2.25, 2.15),
(7, 50.24435258611194, 17.864165470947228),
(8, 50.26191414771696, 17.884421513427696),
(9, 50.247426326651286, 17.882018254150353),
(10, 50.23732614903399, 17.87309186254879),
(11, 50.228912666950386, 17.875781854867228),
(12, 50.232536442296826, 17.883163294076212),
(13, 50.226716305440675, 17.882648309945353),
(14, 50.21931617628606, 17.889914677490196),
(15, 50.2179981063518, 17.886653111328087),
(16, 50.21360427688688, 17.892661259521446),
(17, 50.21953585106785, 17.850046322692833),
(18, 50.22305051000157, 17.862749264587364),
(19, 50.217778424488834, 17.86137597357174),
(20, 50.22502739185025, 17.835283444274864),
(21, 50.22590597970478, 17.846956417907677),
(22, 50.22239153117721, 17.841806576599083),
(23, 50.2338125420924, 17.904634640563927),
(24, 50.23447136311795, 17.921114132751427),
(25, 50.23073792360455, 17.918710873474083),
(26, 50.24610903355128, 17.938623593200646),
(27, 50.24786541626002, 17.955446408142052),
(28, 50.24171779358147, 17.944803402770958),
(29, 50.2360085767754, 17.826013729919396),
(30, 50.24523081792299, 17.837000058044396),
(31, 50.23842409810065, 17.83665673529049),
(32, 50.217558741614276, 17.870302365173302),
(33, 50.21250575629439, 17.879915402282677),
(34, 50.21206634097597, 17.866182492126427),
(35, 50.210967784976226, 17.905664608825646),
(36, 50.20701277396541, 17.893991635192833),
(37, 50.20569436412197, 17.908754513610802),
(38, 50.187452624517285, 17.876138851989708),
(39, 50.18987060511883, 17.890215084899864),
(40, 50.183055982492526, 17.883691952575646),
(41, 50.22810237853296, 17.797517941345177),
(42, 50.2355693779307, 17.803354428161583),
(43, 50.22832201285233, 17.804727719177208),
(44, 50.20129940160564, 17.92901055609127),
(45, 50.20349693344846, 17.947206662048302),
(46, 50.19536556027825, 17.934160397399864),
(47, 50.2179981063518, 17.929697201599083),
(48, 50.21668000000001, 17.945833371032677),
(49, 50.211846631799304, 17.933473751892052),
(50, 50.259499816805736, 17.939310238708458),
(51, 50.26191414771696, 17.955446408142052),
(52, 50.25467078786934, 17.950296566833458),
(53, 50.28122438989283, 17.903947995056114),
(54, 50.28188255557104, 17.920427487243614),
(55, 50.27530048925447, 17.911157772888146),
(56, 50.24523081792299, 17.981882260192833),
(57, 50.23974160360228, 17.986002133239708),
(58, 50.24566992775997, 18.00145165716549),
(59, 50.20657330806429, 17.748422787536583),
(60, 50.213164871684775, 17.766275570739708),
(61, 50.201958671781355, 17.75872247015377),
(62, 50.21206634097597, 17.756662533630333),
(63, 50.2050351455426, 17.766618893493614),
(64, 50.2144830751516, 17.777261898864708),
(86, 50.251377987488674, 17.71580712591549),
(87, 50.256646358870604, 17.74052636419674),
(88, 50.24325477359102, 17.729883358825646),
(107, 50.207891693627616, 17.76975171362301),
(108, 50.21404367804249, 17.78520123754879),
(109, 50.20701277396541, 17.782111332763634),
(110, 50.164805592915116, 17.75601880346676),
(111, 50.17558076218872, 17.766318486083946),
(112, 50.16502551861492, 17.782111332763634),
(113, 50.16942382010533, 17.82262341772457),
(114, 50.16942382010533, 17.84940259252926),
(115, 50.15600773511422, 17.826056645263634),
(116, 50.16766454808164, 17.88236157690426),
(117, 50.17272228059526, 17.903647587646446),
(118, 50.15776743620746, 17.89609448706051),
(119, 50.28297947814441, 17.739153073181114),
(120, 50.29328931470493, 17.75322930609127),
(121, 50.289121777398336, 17.78069512640377),
(122, 50.29638329400997, 17.92423040909432),
(123, 50.29419004145561, 17.945173097082602),
(124, 50.28892582279382, 17.93899328751229),
(125, 50.27946923692541, 18.000078366149864),
(126, 50.27881103787792, 18.022737667907677),
(127, 50.269156406245806, 18.004884884704552),
(128, 50.16282621607917, 17.945833371032677),
(129, 50.17821920880154, 17.95647637640377),
(130, 50.16656497017931, 17.966776059020958),
(131, 50.22173254324872, 17.70756737982174),
(132, 50.20327718481683, 17.689371273864708),
(133, 50.21008892196683, 17.722673580993614),
(134, 50.22305051000157, 17.72649304663082),
(135, 50.228980909741246, 17.75327222143551),
(136, 50.21843746704294, 17.745375798095665);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `fields`
--

CREATE TABLE `fields` (
  `id_field` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_place` int(11) DEFAULT '1',
  `area` double NOT NULL DEFAULT '0',
  `id_color` int(11) DEFAULT '1',
  `description` text COLLATE utf8_polish_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `fields`
--

INSERT INTO `fields` (`id_field`, `id_user`, `id_place`, `area`, `id_color`, `description`) VALUES
(2, 1, 5, 0, 5, 'Jakiś testowy opisik.'),
(4, 1, 2, 16.2889, 6, 'Testowe pole dodane programowo 2'),
(5, 1, 4, 8.8213, 3, 'Testowe pole dodane programowo 3'),
(7, 1, 2, 14.4691, 3, 'abc'),
(8, 1, 5, 23.7578, 3, 'dgsdg'),
(9, 1, 3, 33.5726, 5, 'kgkhkj'),
(10, 1, 3, 28.382, 5, 'sd'),
(11, 1, 3, 29.1887, 2, 'jgjg'),
(12, 1, 3, 29.2559, 4, 'rtuyhru'),
(13, 1, 4, 31.798, 3, 'dfhdrh'),
(14, 1, 4, 20.831, 5, 'dfg'),
(15, 1, 3, 47.3112, 3, 'zfsasf'),
(16, 1, 5, 37.382, 4, 'wsefwaf'),
(17, 1, 3, 41.3743, 6, 'sdgsdg'),
(19, 1, 3, 43.2827, 4, 'asddsad'),
(20, 1, 5, 59.5933, 4, 'dfgds'),
(21, 1, 4, 66.9732, 5, 'fhr'),
(29, 1, 4, 108.9372, 3, 'tera dobre'),
(36, 1, 4, 35.5375, 3, 'drghesg'),
(44, 1, 3, 110.6839, 5, 'dfbdh'),
(58, 1, 1, 142.5867, 1, ''),
(60, 1, 1, 111.178, 1, ''),
(61, 1, 3, 135.2972, 6, 'zdvsvsav'),
(62, 1, 3, 49.0059, 6, 'zdvsvsav'),
(63, 1, 4, 91.2784, 3, 'zvsvbsb'),
(64, 1, 3, 112.1529, 5, 'avasv'),
(65, 1, 2, 93, 3, 'Pole testowe po aktualizacji');

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
(2, 4, 1),
(2, 5, 2),
(2, 6, 3),
(4, 11, 1),
(4, 12, 2),
(4, 13, 3),
(5, 14, 1),
(5, 15, 2),
(5, 16, 3),
(7, 20, 1),
(7, 21, 2),
(7, 22, 3),
(8, 23, 1),
(8, 24, 2),
(8, 25, 3),
(9, 26, 1),
(9, 27, 2),
(9, 28, 3),
(10, 29, 1),
(10, 30, 2),
(10, 31, 3),
(11, 32, 1),
(11, 33, 2),
(11, 34, 3),
(12, 35, 1),
(12, 36, 2),
(12, 37, 3),
(13, 38, 1),
(13, 39, 2),
(13, 40, 3),
(14, 41, 1),
(14, 42, 2),
(14, 43, 3),
(15, 44, 1),
(15, 45, 2),
(15, 46, 3),
(16, 47, 1),
(16, 48, 2),
(16, 49, 3),
(17, 50, 1),
(17, 51, 2),
(17, 52, 3),
(19, 56, 1),
(19, 57, 2),
(19, 58, 3),
(29, 86, 1),
(29, 87, 2),
(29, 88, 3),
(36, 107, 1),
(36, 108, 2),
(36, 109, 3),
(44, 110, 1),
(44, 111, 2),
(44, 112, 3),
(58, 113, 1),
(58, 114, 2),
(58, 115, 3),
(60, 116, 1),
(60, 117, 2),
(60, 118, 3),
(61, 119, 1),
(61, 120, 2),
(61, 121, 3),
(62, 122, 1),
(62, 123, 2),
(62, 124, 3),
(63, 125, 1),
(63, 126, 2),
(63, 127, 3),
(64, 128, 1),
(64, 129, 2),
(64, 130, 3),
(65, 134, 1),
(65, 135, 2),
(65, 136, 3);

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
(2, 6),
(4, 1),
(5, 5),
(5, 6),
(7, 2),
(8, 3),
(9, 2),
(10, 2),
(11, 2),
(12, 3),
(13, 2),
(14, 1),
(15, 3),
(16, 2),
(16, 5),
(17, 3),
(19, 3),
(20, 2),
(21, 3),
(29, 2),
(36, 2),
(36, 3),
(44, 3),
(58, 2),
(61, 1),
(61, 3),
(62, 1),
(62, 3),
(63, 2),
(64, 1),
(64, 3),
(65, 3),
(65, 5);

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
  ADD KEY `fields_ibfk_2` (`id_place`),
  ADD KEY `fields_ibfk_3` (`id_color`);

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
  MODIFY `id_color` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT dla tabeli `coordinates`
--
ALTER TABLE `coordinates`
  MODIFY `id_coor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=137;

--
-- AUTO_INCREMENT dla tabeli `fields`
--
ALTER TABLE `fields`
  MODIFY `id_field` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

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
