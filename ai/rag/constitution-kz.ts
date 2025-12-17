/**
 * Constitution of the Republic of Kazakhstan
 * Excerpts organized by sections for RAG retrieval
 * Source: Official Constitution with amendments as of 2022
 */

export interface ConstitutionSection {
  id: string;
  section: string;
  article: string;
  title: string;
  content: string;
  keywords: string[];
}

export const CONSTITUTION_KZ: ConstitutionSection[] = [
  // SECTION I - GENERAL PROVISIONS
  {
    id: "art-1",
    section: "I. GENERAL PROVISIONS",
    article: "Article 1",
    title: "Republic of Kazakhstan as a State",
    content: `1. The Republic of Kazakhstan proclaims itself a democratic, secular, legal and social state whose highest values are an individual, his life, rights and freedoms.
2. The fundamental principles of the Republic are: public concord and political stability; economic development for the benefit of all the nation; Kazakhstan patriotism and resolution of the most important issues of the affairs of state by democratic methods including voting at an all-nation referendum or in the Parliament.`,
    keywords: ["democracy", "secular state", "human rights", "freedoms", "referendum", "democratic state", "демократия", "светское государство", "права человека"]
  },
  {
    id: "art-2",
    section: "I. GENERAL PROVISIONS",
    article: "Article 2",
    title: "Sovereignty and Territory",
    content: `1. The Republic of Kazakhstan is a unitary state with a presidential form of government.
2. The sovereignty of the Republic extends to its entire territory. The state ensures the integrity, inviolability and inalienability of its territory.
3. The administrative-territorial structure of the Republic and the location and status of its capital are determined by law. The capital of Kazakhstan is the city of Astana.
4. The names "Republic of Kazakhstan" and "Kazakhstan" are equivalent.`,
    keywords: ["unitary state", "presidential", "sovereignty", "territory", "Astana", "capital", "суверенитет", "территория", "столица"]
  },
  {
    id: "art-3",
    section: "I. GENERAL PROVISIONS",
    article: "Article 3",
    title: "People as Source of Power",
    content: `1. The only source of state power is the people.
2. The people exercise power directly through an all-nation referendum and free elections as well as delegate the exercise of their power to state institutions.
3. No one may arrogate the power in the Republic of Kazakhstan. Appropriation of power is prosecuted by law. The right to act on behalf of the people and the state belongs to the President as well as to the Parliament of the Republic within the limits of its constitutional powers. The Government of the Republic and other state bodies act on behalf of the state only within the limits of their delegated authorities.
4. The state power in the Republic is unified and is exercised on the basis of the Constitution and laws in accordance with the principle of its division into the legislative, executive and judicial branches and a system of checks and balances that governs their interaction.`,
    keywords: ["people power", "referendum", "elections", "President", "Parliament", "separation of powers", "народ", "власть", "выборы", "президент", "парламент"]
  },
  {
    id: "art-4",
    section: "I. GENERAL PROVISIONS",
    article: "Article 4",
    title: "Current Law",
    content: `1. The current law of the Republic of Kazakhstan consists of the norms of the Constitution, laws corresponding to it, other regulatory legal acts, international treaties and other commitments of the Republic as well as regulatory resolutions of the Constitutional Court and the Supreme Court of the Republic.
2. The Constitution has the highest juridical force and direct effect on the entire territory of the Republic.
3. International treaties ratified by the Republic have priority over its laws. The procedure and terms for the effect of international treaties to which Kazakhstan is a party on the territory of the Republic of Kazakhstan are determined by the legislation of the Republic.
4. All laws and international treaties to which the Republic is a party are published. Official publication of regulatory legal acts dealing with the rights, freedoms and responsibilities of citizens is a necessary condition for their application.`,
    keywords: ["Constitution", "laws", "international treaties", "juridical force", "Конституция", "законы", "международные договоры"]
  },
  {
    id: "art-5",
    section: "I. GENERAL PROVISIONS",
    article: "Article 5",
    title: "Ideological and Political Diversity",
    content: `1. The Republic of Kazakhstan recognizes ideological and political diversity. The merging of public and state institutions, and the formation of political party organizations in state bodies are not allowed.
2. Public associations are equal before the law. Illegal interference of the state in the affairs of public associations and public associations in the affairs of the state, and imposing the functions of state bodies on public associations are not allowed.
3. The formation and functioning of public associations pursuing the goals or actions directed toward a violent change of the constitutional system, violation of the integrity of the Republic, undermining the security of the state, inciting social, racial, national, religious, class and tribal enmity, as well as the formation of non-envisaged by the legislation paramilitary units are prohibited.
4. In the Republic, activities of political parties and trade unions of other states, religious parties, and also financing of political parties and trade unions by foreign legal entities and citizens, foreign states and international organizations are prohibited.`,
    keywords: ["political parties", "ideological diversity", "public associations", "политические партии", "идеологическое многообразие", "общественные объединения"]
  },
  {
    id: "art-6",
    section: "I. GENERAL PROVISIONS",
    article: "Article 6",
    title: "Property",
    content: `1. In the Republic of Kazakhstan, state and private property are recognized and are equally protected.
2. Property imposes obligations, and its use must at the same time serve the public good. The subjects and objects of property, the amount and limits of the rights of proprietors, and guarantees of their protection are determined by law.
3. The land and underground resources, waters, flora and fauna and other natural resources are state property. The land may also be privately owned on terms, conditions and within the limits established by legislation.`,
    keywords: ["property", "private property", "state property", "land", "natural resources", "собственность", "частная собственность", "земля", "природные ресурсы"]
  },
  {
    id: "art-7",
    section: "I. GENERAL PROVISIONS",
    article: "Article 7",
    title: "Languages",
    content: `1. The state language of the Republic of Kazakhstan is the Kazakh language.
2. In state institutions and local self-administrative bodies the Russian language is officially used on equal grounds along with the Kazakh language.
3. The state takes care of creating conditions for the study and development of the languages of the people of Kazakhstan.`,
    keywords: ["Kazakh language", "Russian language", "state language", "казахский язык", "русский язык", "государственный язык", "тіл"]
  },
  {
    id: "art-8",
    section: "I. GENERAL PROVISIONS",
    article: "Article 8",
    title: "International Principles",
    content: `The Republic of Kazakhstan respects the principles and norms of international law, pursues the policy of cooperation and good-neighborly relations between states, their equality and non-interference in each other's internal affairs, peaceful settlement of international disputes, and rejects the first use of the armed forces.`,
    keywords: ["international law", "cooperation", "peaceful settlement", "международное право", "сотрудничество", "мирное урегулирование"]
  },
  {
    id: "art-9",
    section: "I. GENERAL PROVISIONS",
    article: "Article 9",
    title: "State Symbols",
    content: `The Republic of Kazakhstan has its state symbols - the Flag, Emblem, and Anthem. Their description and order of official use are established by the constitutional law.`,
    keywords: ["state symbols", "flag", "emblem", "anthem", "государственные символы", "флаг", "герб", "гимн"]
  },

  // SECTION II - THE INDIVIDUAL AND CITIZEN
  {
    id: "art-10",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 10",
    title: "Citizenship",
    content: `1. Citizenship of the Republic of Kazakhstan is acquired and terminated as established by law, and is unified and equal regardless of the grounds of its acquisition.
2. A citizen of the Republic may not be deprived of citizenship or the right to change citizenship, and may not be exiled from Kazakhstan. Deprivation of citizenship is allowed only by court decision for committing terrorist crimes, as well as for causing other grave harm to vital interests of the Republic of Kazakhstan.
3. A citizen of the Republic is not recognized as a citizen of another state.`,
    keywords: ["citizenship", "гражданство", "азаматтық", "deprivation of citizenship", "лишение гражданства"]
  },
  {
    id: "art-11",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 11",
    title: "Foreign Citizens and Stateless Persons",
    content: `1. A foreign citizen and a stateless person in Kazakhstan enjoy the rights and freedoms as well as bear the responsibilities established for citizens unless otherwise provided by the Constitution, laws and international treaties.
2. The Republic of Kazakhstan grants political asylum to foreign citizens and stateless persons persecuted for political reasons, as well as for violations of human rights and freedoms.`,
    keywords: ["foreign citizens", "stateless persons", "political asylum", "иностранные граждане", "лица без гражданства", "политическое убежище"]
  },
  {
    id: "art-12",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 12",
    title: "Rights and Freedoms",
    content: `1. Human rights and freedoms in the Republic of Kazakhstan are recognized and guaranteed in accordance with this Constitution.
2. Human rights and freedoms belong to everyone by virtue of birth, are recognized as absolute and inalienable, and define the contents and implementation of laws and other regulatory legal acts.
3. Every citizen of the Republic has by virtue of citizenship rights and bears responsibilities.
4. Foreigners and stateless persons residing in the Republic enjoy the rights and freedoms as well as bear the responsibilities established for citizens, except as otherwise provided by the Constitution, laws and international treaties.
5. The exercise of human and citizen's rights and freedoms must not violate the rights and freedoms of other persons, or infringe on the constitutional system and public morals.`,
    keywords: ["human rights", "freedoms", "rights by birth", "права человека", "свободы", "адам құқықтары", "бостандықтар"]
  },
  {
    id: "art-13",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 13",
    title: "Right to Defense",
    content: `1. Everyone has the right to be recognized as a legal person and to protect his rights and freedoms with all means not contradicting the law, including self-defense.
2. Everyone has the right to judicial defense of his rights and freedoms.
3. Everyone has the right to qualified legal assistance. In cases stipulated by law, legal assistance is provided free of charge.`,
    keywords: ["judicial defense", "legal assistance", "self-defense", "судебная защита", "правовая помощь", "самооборона", "сот қорғауы"]
  },
  {
    id: "art-14",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 14",
    title: "Equality Before the Law",
    content: `1. Everyone is equal before the law and court.
2. No one may be subjected to any discrimination for reasons of origin, social, property status, occupation, sex, race, nationality, language, attitude towards religion, convictions, place of residence or any other circumstances.`,
    keywords: ["equality", "non-discrimination", "equal rights", "равенство", "недискриминация", "теңдік"]
  },
  {
    id: "art-15",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 15",
    title: "Right to Life",
    content: `1. Everyone has the right to life.
2. No one has the right to arbitrarily deprive a person of life. Death penalty is established by law as an exceptional punishment for terrorist crimes involving loss of human life, as well as for especially grave crimes committed in wartime, with the convicted person having the right to petition for a pardon.`,
    keywords: ["right to life", "death penalty", "право на жизнь", "смертная казнь", "өмір сүру құқығы"]
  },
  {
    id: "art-16",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 16",
    title: "Personal Freedom",
    content: `1. Everyone has the right to personal freedom.
2. Arrest and detention are allowed only in cases stipulated by law and only with the sanction of a court with the right to appeal the decision. Without the sanction of a court, a person may be detained for a period no longer than seventy-two hours.
3. Every person detained, arrested, accused of committing a crime has the right to the assistance of a defense lawyer (defender) from the moment of detention, arrest, or accusation.`,
    keywords: ["personal freedom", "arrest", "detention", "defense lawyer", "личная свобода", "арест", "задержание", "защитник", "жеке бостандық"]
  },
  {
    id: "art-17",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 17",
    title: "Dignity",
    content: `1. The dignity of an individual is inviolable.
2. No one may be subjected to torture, violence, or other cruel or degrading treatment or punishment.`,
    keywords: ["dignity", "torture prohibition", "достоинство", "запрет пыток", "қадір-қасиет"]
  },
  {
    id: "art-18",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 18",
    title: "Privacy",
    content: `1. Everyone has the right to inviolability of private life, personal and family secrets, protection of honor and dignity.
2. Everyone has the right to confidentiality of personal deposits and savings, correspondence, telephone conversations, postal, telegraph and other communications. Limitation of this right is allowed only in cases and according to the procedure directly established by law.
3. State bodies, public associations, officials, and the media must ensure that every citizen has the opportunity to access documents, decisions and other sources of information concerning his rights and interests.`,
    keywords: ["privacy", "personal secrets", "correspondence", "частная жизнь", "личная тайна", "переписка", "жеке өмір"]
  },
  {
    id: "art-19",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 19",
    title: "National Identity",
    content: `1. Everyone has the right to determine and indicate or not indicate his national, party and religious affiliation.
2. Everyone has the right to use his native language and culture, and to freely choose the language of communication, education, instruction and creative activity.`,
    keywords: ["national identity", "native language", "culture", "национальная принадлежность", "родной язык", "культура", "ұлттық тиесілік"]
  },
  {
    id: "art-20",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 20",
    title: "Freedom of Speech",
    content: `1. Freedom of speech and creative activity is guaranteed. Censorship is prohibited.
2. Everyone has the right to freely receive and disseminate information by any means not prohibited by law. The list of information constituting state secrets of the Republic of Kazakhstan is determined by law.
3. Propaganda or agitation for the forcible change of the constitutional system, violation of the integrity of the Republic, undermining of state security, and inciting social, racial, national, religious, class and tribal superiority as well as the cult of cruelty and violence is not allowed.`,
    keywords: ["freedom of speech", "censorship", "information", "свобода слова", "цензура", "информация", "сөз бостандығы"]
  },
  {
    id: "art-21",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 21",
    title: "Freedom of Movement",
    content: `1. Everyone who lawfully resides in the territory of the Republic of Kazakhstan has the right to free movement across its territory and free choice of residence, except in cases stipulated by law.
2. Everyone has the right to leave the territory of the Republic. Citizens of the Republic have the right to return to the Republic without any hindrance.`,
    keywords: ["freedom of movement", "residence", "leaving country", "свобода передвижения", "место жительства", "выезд", "қозғалыс бостандығы"]
  },
  {
    id: "art-22",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 22",
    title: "Freedom of Conscience",
    content: `1. Everyone has the right to freedom of conscience.
2. The right to freedom of conscience must not define or limit human and civil rights and duties before the state.`,
    keywords: ["freedom of conscience", "religion", "свобода совести", "религия", "ар-ождан бостандығы"]
  },
  {
    id: "art-23",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 23",
    title: "Freedom of Association",
    content: `1. Citizens of the Republic of Kazakhstan have the right to freedom of associations. The activities of public associations are regulated by law.
2. Military personnel, employees of national security bodies, law enforcement bodies, and judges must not be members of parties, trade unions, or act in support of any political party.`,
    keywords: ["freedom of association", "public associations", "political parties", "свобода объединений", "общественные объединения", "бірлестік бостандығы"]
  },
  {
    id: "art-24",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 24",
    title: "Right to Work",
    content: `1. Everyone has the right to freedom of labor, and free choice of occupation and profession. Forced labor is allowed only when sentenced by court or in conditions of a state of emergency or martial law.
2. Everyone has the right to safe and hygienic working conditions, fair remuneration for labor without discrimination, and social protection from unemployment.
3. The right to individual and collective labor disputes with the use of methods for resolving them established by law, including the right to strike, is recognized.
4. Everyone has the right to rest. Working hours, days of rest, holidays and annual paid leave, as well as other basic conditions for the implementation of this right, are established by law for those working under labor contracts.`,
    keywords: ["right to work", "labor", "fair remuneration", "strike", "rest", "право на труд", "труд", "забастовка", "отдых", "еңбек құқығы"]
  },
  {
    id: "art-25",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 25",
    title: "Inviolability of Housing",
    content: `1. Housing is inviolable. Deprivation of housing is not allowed except by a court decision. Entry into housing, its inspection and search are allowed only in cases and according to the procedure established by law.
2. Conditions for providing citizens with housing are established by law. Citizens in need of housing specified by law are provided with housing for a fee affordable to them from the state housing funds in accordance with the norms established by law.`,
    keywords: ["housing", "inviolability of housing", "жилище", "неприкосновенность жилища", "тұрғын үй"]
  },
  {
    id: "art-26",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 26",
    title: "Property Rights",
    content: `1. Citizens of the Republic of Kazakhstan may privately own any legally acquired property.
2. Property, including the right of inheritance, is guaranteed by law.
3. No one may be deprived of his property except by a court decision. Expropriation of property for state needs in exceptional cases provided for by law may be made with equal compensation for the value of the property.
4. Everyone has the right to freedom of entrepreneurial activity and free use of his property for any legitimate entrepreneurial activity. Monopolistic activity is regulated and limited by law. Unfair competition is prohibited.`,
    keywords: ["property rights", "inheritance", "entrepreneurship", "right of property", "право собственности", "наследование", "предпринимательство", "меншік құқығы"]
  },
  {
    id: "art-27",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 27",
    title: "Family",
    content: `1. Marriage and family, motherhood, fatherhood and childhood are under the protection of the state.
2. Care of children and their upbringing is the natural right and duty of parents.
3. Adult able-bodied children must take care of their disabled parents.`,
    keywords: ["family", "marriage", "children", "parents", "семья", "брак", "дети", "родители", "отбасы", "неке"]
  },
  {
    id: "art-28",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 28",
    title: "Social Security",
    content: `1. A citizen of the Republic of Kazakhstan is guaranteed a minimum wage and pension, and social security in old age, in case of illness, disability, loss of a breadwinner and other legitimate grounds.
2. Voluntary social insurance, creation of additional forms of social security and charity are encouraged.`,
    keywords: ["social security", "pension", "minimum wage", "disability", "социальное обеспечение", "пенсия", "минимальная зарплата", "әлеуметтік қамсыздандыру"]
  },
  {
    id: "art-29",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 29",
    title: "Health Protection",
    content: `1. Citizens of the Republic of Kazakhstan have the right to health protection.
2. Citizens of the Republic have the right to receive a guaranteed amount of free medical care established by law.
3. Paid medical treatment in state and private medical institutions as well as treatment by persons engaged in private medical practice is provided in accordance with the procedure established by law.`,
    keywords: ["health", "medical care", "free medical care", "здоровье", "медицинская помощь", "бесплатная медицина", "денсаулық"]
  },
  {
    id: "art-30",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 30",
    title: "Education",
    content: `1. Citizens are guaranteed free secondary education in state educational institutions. Secondary education is compulsory.
2. A citizen has the right to receive free higher education in state institutions of higher education on a competitive basis.
3. Paid education in private educational institutions is provided in accordance with the procedure established by law.
4. The state establishes compulsory standards of education. The activities of any educational institutions must comply with these standards.`,
    keywords: ["education", "free education", "secondary education", "higher education", "образование", "бесплатное образование", "білім"]
  },
  {
    id: "art-31",
    section: "II. THE INDIVIDUAL AND CITIZEN",
    article: "Article 31",
    title: "Environmental Protection",
    content: `1. The state sets the objective of protecting the environment favorable for human life and health.
2. Concealment by officials of facts and circumstances threatening the life and health of people is prohibited by law.`,
    keywords: ["environment", "environmental protection", "ecology", "окружающая среда", "экология", "қоршаған орта"]
  },

  // SECTION III - THE PRESIDENT
  {
    id: "art-40",
    section: "III. THE PRESIDENT",
    article: "Article 40",
    title: "Status of the President",
    content: `1. The President of the Republic of Kazakhstan is the head of state, its highest official, determining the main directions of the domestic and foreign policy of the state and representing Kazakhstan within the country and in international relations.
2. The President of the Republic is the symbol and guarantor of the unity of the people and the state power, inviolability of the Constitution, rights and freedoms of the individual and citizen.
3. The President of the Republic ensures the coordinated functioning of all branches of state power and the responsibility of its bodies before the people.`,
    keywords: ["President", "head of state", "guarantor", "Президент", "глава государства", "гарант", "Президент"]
  },
  {
    id: "art-41",
    section: "III. THE PRESIDENT",
    article: "Article 41",
    title: "Presidential Elections",
    content: `1. The President of the Republic of Kazakhstan is elected by the citizens of the state who have reached the age of eighteen, based on universal, equal and direct suffrage by secret ballot for a term of seven years in accordance with the constitutional law.
2. A citizen of the Republic by birth, not younger than forty years of age, fluent in the state language, having lived in Kazakhstan for at least the past fifteen years, and having higher education may be elected President of the Republic of Kazakhstan. The constitutional law may establish additional requirements for candidates for the President of the Republic.
3. Regular elections of the President of the Republic are held on the first Sunday of December and may not coincide with the elections of a new Parliament of the Republic.
4. A candidate who receives more than fifty percent of the votes of voters who took part in the voting is considered elected.`,
    keywords: ["presidential elections", "voting", "election requirements", "президентские выборы", "голосование", "президенттік сайлау"]
  },
  {
    id: "art-42",
    section: "III. THE PRESIDENT",
    article: "Article 42",
    title: "Presidential Oath and Term",
    content: `1. The President of the Republic of Kazakhstan assumes office from the moment of taking the oath to the people of Kazakhstan in the second Wednesday of January.
2. The powers of the President of the Republic terminate from the moment the newly elected President of the Republic assumes office, as well as in the case of early release or removal of the President from office or his death. All former presidents of the Republic, except those who were removed from office, have the title of ex-President of the Republic of Kazakhstan.
3. The same person may not be elected President of the Republic more than once.
4. The status, powers and organization of activities of the ex-President are determined by law.`,
    keywords: ["presidential oath", "term of office", "ex-President", "присяга президента", "срок полномочий", "президенттік ант"]
  },
  {
    id: "art-44",
    section: "III. THE PRESIDENT",
    article: "Article 44",
    title: "Presidential Powers",
    content: `The President of the Republic of Kazakhstan:
1) addresses annual messages to the people of Kazakhstan on the situation in the country and the main directions of domestic and foreign policy of the Republic;
2) appoints regular and extraordinary elections to the Parliament of the Republic and its Chambers; convenes the first session of the Parliament and accepts the oath of its deputies to the people of Kazakhstan; convenes extraordinary joint sessions of the Chambers of Parliament; signs laws presented by the Senate of the Parliament within one month, promulgates them or returns laws or individual articles for reconsideration and re-voting;
3) with the consent of the Mazhilis of the Parliament, appoints the Prime Minister of the Republic; dismisses the Prime Minister; determines the structure of the Government of the Republic on the proposal of the Prime Minister;
4) with the consent of the Senate of Parliament, appoints the Chairperson of the National Bank, the Prosecutor General, the Chairperson of the Committee of National Security of the Republic; dismisses them from office;
5) appoints and dismisses members of the Government of the Republic;
6) appoints members of the Constitutional Court;
7) appoints and recalls heads of diplomatic missions of the Republic;
8) appoints the Chairperson and two members of the Central Election Commission, Chairperson and two members of the Accounts Committee for Control over the Execution of the Republican Budget;
9) is the Supreme Commander-in-Chief of the Armed Forces of the Republic, appoints and dismisses the Supreme Command of the Armed Forces;
10) awards state prizes of the Republic, confers honorary, high military and other ranks, class ranks, diplomatic ranks, qualification classes; deprives of awards, ranks and titles;
11) decides issues of citizenship of the Republic, granting political asylum;
12) exercises pardon of citizens;
13) in the event of a serious and immediate threat to the democratic institutions of the Republic, its independence and territorial integrity, the political stability of the Republic, the security of its citizens and the disruption of normal functioning of the constitutional bodies of the state, after official consultations with the Prime Minister and the chairmen of the Chambers of the Parliament of the Republic, takes measures dictated by the above circumstances, including the introduction on the entire territory of Kazakhstan or in its certain areas of a state of emergency with the use of the Armed Forces of the Republic, with immediate notification of the Parliament of the Republic;
14) in case of aggression against the Republic or an immediate external threat to its security, imposes martial law on the entire territory of the Republic or in its certain areas, declares partial or general mobilization and immediately notifies the Parliament of the Republic;
15) forms the Security Council subordinated directly to him;
16) forms the Administration of the President of the Republic;
17) makes decisions on holding an all-nation referendum.`,
    keywords: ["presidential powers", "Prime Minister", "Government", "martial law", "state of emergency", "полномочия президента", "Премьер-министр", "военное положение", "президент өкілеттіктері"]
  },

  // SECTION IV - PARLIAMENT
  {
    id: "art-49",
    section: "IV. PARLIAMENT",
    article: "Article 49",
    title: "Parliament Structure",
    content: `1. The Parliament of the Republic of Kazakhstan is the highest representative body of the Republic exercising legislative functions.
2. The powers of the Parliament begin from the moment of opening of its first session and end with the beginning of the work of the first session of the Parliament of the new convocation.
3. The powers of the Parliament may be terminated early in cases and according to the procedure provided for by the Constitution.
4. The organization and activities of the Parliament, the legal status of its deputies are determined by constitutional law.`,
    keywords: ["Parliament", "legislative", "representative body", "Парламент", "законодательный орган", "Парламент"]
  },
  {
    id: "art-50",
    section: "IV. PARLIAMENT",
    article: "Article 50",
    title: "Parliament Composition",
    content: `1. The Parliament consists of two Chambers acting on a permanent basis: the Senate and the Mazhilis.
2. The Senate is composed of deputies elected from each oblast, the cities of republican significance and the capital of the Republic – two persons from each – at joint sessions of deputies of all representative bodies of the respective oblast, city of republican significance and the capital of the Republic. Fifteen deputies of the Senate are appointed by the President of the Republic taking into account the need to ensure representation in the Senate of national, cultural and other significant interests of society.
3. The Mazhilis consists of ninety-eight deputies elected according to the procedure established by the constitutional law.
4. A deputy of the Parliament may not be a member of both Chambers at the same time.
5. The term of office of the Senate deputies is six years; the term of office of the Mazhilis deputies is five years.`,
    keywords: ["Senate", "Mazhilis", "deputies", "elections", "Сенат", "Мажилис", "депутаты", "Сенат", "Мәжіліс"]
  },
  {
    id: "art-54",
    section: "IV. PARLIAMENT",
    article: "Article 54",
    title: "Parliament Legislative Powers",
    content: `1. The Parliament in a joint session of the Chambers:
1) upon the proposal of the President of the Republic introduces amendments and additions to the Constitution;
2) approves reports of the Government and the Accounts Committee for Control over the Execution of the Republican Budget on the execution of the republican budget. Non-approval by the Parliament of the report of the Government on the execution of the republican budget means expression of a vote of no confidence to the Government;
3) has the right to delegate legislative powers to the President of the Republic for a period not exceeding one year by two-thirds of the votes from the total number of deputies of each Chamber upon his initiative;
4) decides issues of war and peace;
5) upon the proposal of the President of the Republic makes decisions on the use of the Armed Forces of the Republic to fulfill international obligations to maintain peace and security;
6) hears annual messages of the Constitutional Court on the state of constitutional legality in the Republic.`,
    keywords: ["legislative powers", "constitutional amendments", "vote of no confidence", "законодательные полномочия", "поправки к конституции", "заң шығару өкілеттіктері"]
  },

  // SECTION V - GOVERNMENT
  {
    id: "art-64",
    section: "V. GOVERNMENT",
    article: "Article 64",
    title: "Government Status",
    content: `1. The Government implements the executive power of the Republic of Kazakhstan, heads the system of executive bodies and directs their activities.
2. The Government in its activities is responsible before the President of the Republic and accountable to the Parliament.
3. Members of the Government are accountable to the Chambers of the Parliament in the case provided for by subparagraph 6) of Article 57 of the Constitution.
4. The competence, procedure for organization and activities of the Government are determined by the constitutional law.`,
    keywords: ["Government", "executive power", "accountability", "Правительство", "исполнительная власть", "подотчетность", "Үкімет"]
  },
  {
    id: "art-65",
    section: "V. GOVERNMENT",
    article: "Article 65",
    title: "Government Formation",
    content: `1. The Government is formed by the President of the Republic in the manner provided for by the Constitution.
2. Proposals on the structure and composition of the Government are submitted to the President of the Republic by the Prime Minister of the Republic within ten days after the appointment of the Prime Minister.
3. Members of the Government take an oath to the people and the President of Kazakhstan.`,
    keywords: ["Government formation", "Prime Minister", "cabinet", "формирование правительства", "Премьер-министр", "Үкімет құру"]
  },
  {
    id: "art-66",
    section: "V. GOVERNMENT",
    article: "Article 66",
    title: "Government Powers",
    content: `The Government of the Republic of Kazakhstan:
1) develops the main directions of the socio-economic policy of the state, its defense capability, security, ensuring public order and organizes their implementation; organizes the management of state property upon the instruction of the President;
2) develops and presents to the Parliament the republican budget and the report on its execution, ensures the execution of the budget;
3) introduces draft laws to the Mazhilis and ensures the implementation of laws;
4) organizes the management of state property;
5) develops measures for the implementation of the foreign policy of the Republic;
6) directs the activities of ministries, state committees, other central and local executive bodies;
7) cancels or suspends wholly or in part the effect of acts of ministries, state committees, other central and local executive bodies of the Republic;
8) appoints and dismisses heads of central executive bodies not included in the Government;
9) performs other functions assigned to it by the Constitution, laws and acts of the President.`,
    keywords: ["Government powers", "budget", "state management", "полномочия правительства", "бюджет", "государственное управление", "Үкімет өкілеттіктері"]
  },

  // SECTION VI - CONSTITUTIONAL COURT
  {
    id: "art-71",
    section: "VI. CONSTITUTIONAL COURT",
    article: "Article 71",
    title: "Constitutional Court",
    content: `1. The Constitutional Court of the Republic of Kazakhstan consists of eleven judges whose powers last for six years. The retirement age of judges of the Constitutional Court is seventy years.
2. The Chairperson of the Constitutional Court is appointed by the President of the Republic with the consent of the Senate of Parliament.
3. Four judges of the Constitutional Court are appointed by the President of the Republic, three judges are appointed by the Chairperson of the Senate and three judges are appointed by the Chairperson of the Mazhilis. Ex-Presidents of the Republic are life members of the Constitutional Court.
4. The position of the Chairperson and judge of the Constitutional Court is incompatible with being a deputy, holding other paid positions except teaching, scientific or other creative activity, engaging in other paid activity, or being a member of a commercial organization.`,
    keywords: ["Constitutional Court", "judges", "constitutional legality", "Конституционный суд", "судьи", "Конституциялық сот"]
  },
  {
    id: "art-72",
    section: "VI. CONSTITUTIONAL COURT",
    article: "Article 72",
    title: "Constitutional Court Powers",
    content: `1. The Constitutional Court upon appeals of the President of the Republic, the Chairperson of the Senate, the Chairperson of the Mazhilis, not less than one fifth of the total number of deputies of the Parliament, the Prime Minister:
1) decides in case of a dispute the issue of correctness of the elections of the President of the Republic, deputies of the Parliament;
2) examines before signing by the President the laws adopted by the Parliament for their compliance with the Constitution of the Republic;
3) examines before ratification the international treaties of the Republic for their compliance with the Constitution;
4) gives official interpretation of the norms of the Constitution;
5) gives opinions in cases provided for by paragraphs 1 and 2 of Article 47 of the Constitution.
2. The Constitutional Court examines appeals of courts in cases provided for by Article 78 of the Constitution.
3. The Constitutional Court upon appeals of citizens considers normative legal acts of the Republic of Kazakhstan directly affecting their rights and freedoms enshrined in the Constitution for their compliance with the Constitution.`,
    keywords: ["Constitutional Court powers", "constitutional review", "interpretation", "полномочия Конституционного суда", "конституционный контроль", "Конституциялық сот өкілеттіктері"]
  },

  // SECTION VII - COURTS AND JUSTICE
  {
    id: "art-75",
    section: "VII. COURTS AND JUSTICE",
    article: "Article 75",
    title: "Justice System",
    content: `1. Justice in the Republic of Kazakhstan is exercised only by the court.
2. Judicial power is exercised through civil, criminal and other forms of legal proceedings established by law. In cases provided for by law, criminal proceedings are carried out with the participation of jurors.
3. The courts of the Republic are the Supreme Court of the Republic and local courts of the Republic established by law.
4. The judicial system of the Republic is established by the Constitution of the Republic and constitutional law. The establishment of special and extraordinary courts under any name is not allowed.`,
    keywords: ["justice", "courts", "Supreme Court", "judicial system", "правосудие", "суды", "Верховный суд", "сот жүйесі"]
  },
  {
    id: "art-77",
    section: "VII. COURTS AND JUSTICE",
    article: "Article 77",
    title: "Principles of Justice",
    content: `1. A judge, when exercising justice, is independent and subject only to the Constitution and the law.
2. Any interference in the activities of the court in the administration of justice is unacceptable and punishable by law. Judges are not accountable for specific cases.
3. The application of a law or other regulatory legal act when administering justice is carried out in accordance with the following principles:
1) a person is considered innocent of committing a crime until his guilt is established by a court verdict that has entered into legal force;
2) no one may be subjected to repeated conviction and punishment for the same offence;
3) the jurisdiction of a case may not be changed without the consent of a person whose case under the jurisdiction of law is subject to consideration;
4) in court everyone has the right to be heard;
5) laws establishing or increasing liability, imposing new obligations on citizens or worsening their situation do not have retroactive force. If after the commission of an offence the liability for it is lifted or mitigated by law, the new law applies;
6) the accused is not obliged to prove his innocence;
7) no one is obliged to give testimony against himself, his spouse and close relatives, the circle of which is determined by law. Clergy is not obliged to testify against persons who entrusted confessions to them;
8) any doubts regarding the guilt of a person are interpreted in favor of the accused;
9) evidence obtained illegally has no legal force; no one may be convicted solely on the basis of his own confession;
10) application of criminal law by analogy is not allowed.
4. The principles of justice established by the Constitution are common and unified for all courts and judges of the Republic.`,
    keywords: ["principles of justice", "presumption of innocence", "right to be heard", "принципы правосудия", "презумпция невиновности", "сот төрелігі қағидаттары"]
  },

  // SECTION VIII - LOCAL GOVERNMENT
  {
    id: "art-85",
    section: "VIII. LOCAL GOVERNMENT",
    article: "Article 85",
    title: "Local Self-Government",
    content: `Local self-government is exercised by the population directly, as well as through maslikhats and other local self-government bodies in local communities covering territories where compact groups of the population live.
Local self-government bodies are not part of the system of state bodies.`,
    keywords: ["local self-government", "maslikhats", "местное самоуправление", "маслихаты", "жергілікті өзін-өзі басқару"]
  },
  {
    id: "art-86",
    section: "VIII. LOCAL GOVERNMENT",
    article: "Article 86",
    title: "Maslikhats",
    content: `1. Maslikhats express the will of the population of respective administrative-territorial units and with regard to the common state interests determine the measures necessary for its implementation and control their implementation.
2. Maslikhats are elected by the population on the basis of universal, equal and direct suffrage by secret ballot for a term of five years.
3. The competence of maslikhats, the procedure for their organization and activities, the legal status of their deputies are established by law.`,
    keywords: ["maslikhats", "local representative bodies", "elections", "маслихаты", "местные представительные органы", "мәслихаттар"]
  },

  // SECTION IX - FINAL PROVISIONS
  {
    id: "art-91",
    section: "IX. FINAL AND TRANSITIONAL PROVISIONS",
    article: "Article 91",
    title: "Constitutional Amendments",
    content: `1. Amendments and additions to the Constitution of the Republic of Kazakhstan may be introduced by a republican referendum held by decision of the President of the Republic made on his own initiative, upon the proposal of the Parliament or the Government. A draft of amendments and additions to the Constitution is not submitted to a republican referendum if the President decides to submit it to the Parliament. The Parliament's decision is adopted in the manner established by this Constitution.
2. Amendments and additions to the Constitution submitted to a republican referendum are considered adopted if more than half of the citizens who took part in the voting in at least two-thirds of oblasts, cities of republican significance, and the capital voted for them.
3. The independence of the state, unitariness and territorial integrity of the Republic, the form of its government, as well as fundamental principles of the Republic's activities laid down by the Founder of independent Kazakhstan, the First President of the Republic of Kazakhstan - Elbasy, and his status are unchangeable.`,
    keywords: ["constitutional amendments", "referendum", "unchangeable provisions", "поправки к конституции", "референдум", "конституцияға өзгерістер"]
  },
  {
    id: "art-92",
    section: "IX. FINAL AND TRANSITIONAL PROVISIONS",
    article: "Article 92",
    title: "Constitutional Laws",
    content: `1. Constitutional laws must be adopted within one year from the date of entry into force of the Constitution. If the laws named in the Constitution as constitutional are adopted by that time or indicated as being in force, they are brought into compliance with the Constitution and are considered constitutional laws of the Republic of Kazakhstan.
2. Other laws named in the Constitution must be adopted according to the procedure and within the terms determined by the Parliament, but not later than two years from the date of entry into force of the Constitution.`,
    keywords: ["constitutional laws", "legislation", "конституционные законы", "законодательство", "конституциялық заңдар"]
  }
];

/**
 * Simple keyword-based search for RAG
 * Returns relevant sections based on query matching
 */
export function searchConstitution(query: string, limit: number = 5): ConstitutionSection[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
  
  const scored = CONSTITUTION_KZ.map(section => {
    let score = 0;
    const contentLower = section.content.toLowerCase();
    const titleLower = section.title.toLowerCase();
    
    // Check keywords
    section.keywords.forEach(keyword => {
      if (queryLower.includes(keyword.toLowerCase())) {
        score += 10;
      }
    });
    
    // Check content
    queryWords.forEach(word => {
      if (contentLower.includes(word)) {
        score += 2;
      }
      if (titleLower.includes(word)) {
        score += 5;
      }
    });
    
    // Exact phrase matching
    if (contentLower.includes(queryLower)) {
      score += 20;
    }
    
    return { section, score };
  });
  
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.section);
}

/**
 * Format constitution sections for AI context
 */
export function formatConstitutionContext(sections: ConstitutionSection[]): string {
  if (sections.length === 0) {
    return "No directly relevant articles found in the Constitution of Kazakhstan.";
  }
  
  return sections.map(section => 
    `📜 ${section.article}: ${section.title}\n` +
    `Section: ${section.section}\n` +
    `Content: ${section.content}`
  ).join('\n\n---\n\n');
}

