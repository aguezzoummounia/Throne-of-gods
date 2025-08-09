const quizData = {
  questions: [
    {
      id: 1,
      text: "When power slips from your grasp, how do you reclaim it?",
      answers: [
        {
          text: "Outwit those above me",
          villains: ["leticia", "isolde"],
        },
        {
          text: "Burn the world if I must",
          villains: ["eternal-flames", "agon"],
        },
        {
          text: "Wait in the shadows. The deeper the patience, the sharper the strike",
          villains: ["harald", "queen-of-deep"],
        },
        {
          text: "Declare myself chosen. Those who disagree are unworthy",
          villains: ["agon", "jarvan"],
        },
        {
          text: "Crush the weak and rebuild my empire from their bones",
          villains: ["valeon", "nicolas"],
        },
      ],
    },
    {
      id: 2,
      text: "What would you sacrifice for eternal control?",
      answers: [
        {
          text: "Love. It’s a weakness I buried long ago",
          villain: "isolde",
          // Isolde, Queen of the Deep
        },
        {
          text: "The lives of others",
          villain: "agon",
          // Agon, Order of Eternal Flames
        },
        {
          text: "My name, my past, even my soul. Only power matters",
          villain: "harald",
          // Valeon, Harald
        },
        {
          text: "Nothing. Control is my birthright, not a bargain",
          villain: "jarvan",
        },
        {
          text: " Everything. Especially those who ever doubted me",
          villain: "leticia",
          // Leticia, Nicolas
        },
      ],
    },
    {
      id: 3,
      text: "When confronted with betrayal, how do you respond?",
      answers: [
        {
          text: "I feign ignorance… until the knife turns in their gut",
          villain: "isolde",
          // Leticia, Isolde
        },
        {
          text: "I declare holy vengeance, with flames for justice",
          villain: "eternal-flames",
          // Agon, Order of Eternal Flames
        },
        {
          text: "I disappear. But they drown in nightmares of my return",
          villain: "queen-of-deep",
        },
        {
          text: "I strike first. Let none dare betray me again",
          villain: "jarvan",
        },
        {
          text: "I make them beg for forgiveness… and then flay their name from history",
          villain: "nicolas",
          //Nicolas, Valeon
        },
      ],
    },
    {
      id: 4,
      text: "What is your legacy, carved in blood and history",
      answers: [
        {
          text: "A kingdom built from shadows, puppets, and lies",
          villain: "leticia",
          // Isolde, Leticia
        },
        {
          text: "A war cry that still echoes through burning altars",
          villain: "agon",
          // Agon, Order of Eternal Flames
        },
        {
          text: "A name erased by gods… and returned through vengeance",
          villain: "queen-of-deep",
          // Valeon, Harald
        },
        {
          text: "The first to silence heaven. The last to kneel",
          villain: "jarvan",
        },
        {
          text: "None will speak of me kindly. But they will remember",
          villain: "leticia",
          // Nicolas, Harald, Valeon
        },
      ],
    },
    {
      id: 5,
      text: "Which quote resonates with your soul the most?",
      answers: [
        {
          text: "The weak pray. The strong rule",
          villain: "jarvan",
        },
        { text: "Gold burns brighter than glory.", villain: "valeon" },
        { text: "Power is beauty. Beauty is control.", villain: "leticia" },
        {
          text: "Let the world believe my pain if it keeps me on the throne.",
          villain: "isolde",
        },
        {
          text: "We rose from darkness to reclaim the sun.",
          villain: "king-of-deep",
        },
      ],
    },
    {
      id: 6,
      text: "In the end, what do you truly seek?",
      answers: [
        {
          text: "Immortality through legacy and wealth.",
          villain: "valeon",
        },
        { text: "Control everything from the shadows.", villain: "leticia" },
        {
          text: "To stay in charge, no matter who I have to hurt",
          villain: "isolde",
        },
        {
          text: "To break all rules and become more powerful than the gods",
          villain: "jarvan",
        },
        { text: "To feel strong by keeping others weak", villain: "nicolas" },
      ],
    },
  ],
  villains: {
    jarvan: {
      slug: "jarvan",
      name: "Jarvan the First",
      image: "/images/villains/villain-1.jpeg",
      nickname: "The Hollow Queen",
      quote: "The strong rule, The weak pray.",
      overview:
        "Jarvan the First was the 'Emperor of Galeeria', one of three rulers who governed Erosea in the Age of Divine Unity. His reign was characterized by a profound **corruption of divine power**, which he manifested by outlawing prayer and burning temples across the frozen north. He famously declared his philosophy, 'The strong rule' and 'The weak pray' embodying a tyrannical approach to governance. His actions, alongside Valeon's, contributed significantly to the **world's fracturing**, causing mountains to melt, seas to boil, and deserts to spread. He is remembered as a **tyrant** whose legacy shaped subsequent rulers and conflicts",
      relations: [
        "Former Allies (Reluctant):** Valeon, Crascius Velathor",
        "Enemy: Goddess Law (whom he defied)",
        "Enemy: The King and Queen of the Deep",
      ],
      powers: [
        "Corrupted Divine Power: He fundamentally twisted the nature of divine power.",
        "Lightning: His specific manifestation of divine power, contributing to the 'Trinity' of imperial powers during the War of Depths. His descendant, Kaen, inherits a similar 'storm' ability",
      ],
      stats: {
        race: "Human",
        age: "Ancient",
        faction: "Galeerian Empire",
        alignment: "Lawful Evil",
        status: "Deceased",
        role: "Emperor",
        location: "Galeeria",
      },
      trivia: [
        "He is the **ancestor of Prince Kaen**, who later displays a similar, uncontrolled lightning power, leading to the prophecy of 'Jarvan's blood... the old blood awakens'",
        "His refusal to kneel to Goddess Law showcased his 'unyielding pride'",
        "His 'voice permanently vanished' after the death of Goddess Law, who collapsed in his arms",
      ],
      backstory: `
        The Age of Divine Unity and Corruption:
         During the Age of Divine Unity, Jarvan the First stood as one of Erosea's three emperors, each uniquely twisting divine power to their will. While Crascius Velathor maintained faith, Jarvan outlawed prayer and destroyed religious sites, proclaiming a doctrine of strength over devotion. This clash of ideologies and powers between him and Crascius, exacerbated by Valeon's profiteering, caused the very fabric of the world to crack, leading to ecological devastation.
         The War of Depths and Defiance:
          When monstrous creatures emerged from the deep, threatening all of Erosea, Jarvan the First was compelled to unite with Valeon and Crascius. In this unprecedented alliance, their combined powers—Jarvan's lightning, Valeon's purifying fire, and Crascius's divine flame—drove back the horrors. However, when Goddess Law descended to intervene, commanding all to kneel, Jarvan defiantly remained standing. The Queen of the Deep referred to him as "Storm-Emperor," hinting at his innate connection to tempestuous power, and even implicated him in the unleashing of Law upon themselves. His steadfast defiance marked him, though his voice ultimately broke and never returned after Goddess Law's death in his arms.
      `,
    },
    valeon: {
      nickname: "",
      quote:
        "He turned his sacred flame into currency, his forges churning steel for any king with gold.",
      overview:
        "Valeon was the 'ruler of Valemyra', the verdant southern lands of Erosea. Unlike his counterparts, Jarvan the First and Crascius Velathor, Valeon's corruption of divine power was rooted in **greed**; he transformed his sacred flame into currency, using his forges to churn out steel for any king willing to pay. He notoriously **profited from the protracted war** between Jarvan and Crascius, contributing to the world's devastation through his mercantile practices. His infamy stems from prioritizing wealth over sacred duty, a choice that ultimately led to his demise from a 'blood curse' that now afflicts his descendants. He is remembered as a 'gold-obsessed emperor'",
      relations: [
        "Former Allies (Reluctant):** Jarvan the First, Crascius Velathor (during War of Depths)",
        "Enemy:** The King and Queen of the Deep",
      ],
      powers: [
        "Sacred Flame / Purifying Fire: A divine power he possessed and corrupted for monetary gain. This power, when corrupted, led to the blood curse.",
      ],
      stats: {
        race: "Human",
        age: "Ancient",
        faction: "Valemyra",
        alignment: "Neutral Evil",
        status: "Deceased",
        role: "Emperor",
        location: "Valemyra",
      },
      trivia: [
        "His lineage is cursed with a **burning illness**, seen in Reynold and Queen Isolde's son, Teralion.",
        "His insatiable **greed** and willingness to profit from war made him an object of scorn, even from his reluctant allies.",
        "His internal fires symbolically 'died in the forge' following the cataclysmic events involving Goddess Law.",
      ],
      name: "Valeon",
      slug: "valeon",
      image: "/images/villains/villain-2.jpeg",
      backstory: `
      The Price of Greed:
     Valeon was entrusted with the "flame of divine purification," a power meant to cleanse corrupted souls and mend the fractured world. However, he **chose wealth over duty**, transforming this sacred gift into a means of amassing immense riches through commercial enterprises. His forges produced steel for any willing buyer, fueling the wars of his neighbors and profiting from destruction. The gods, displeased with his avarice, exacted a heavy price: Valeon was **consumed by the very fire he carried**, dying from a blood curse that has since plagued his lineage.

Reluctant Unity and Tragic End:
     Despite his self-serving nature, Valeon was forced into a temporary alliance with Jarvan and Crascius during the War of Depths. He expressed visceral disgust at the display of unity and love by the King and Queen of the Deep, which starkly contrasted his own isolation. He contributed his "purifying fire" to the collective effort that drove back the deep creatures. After the Queen of the Deep's demise, Valeon was visibly shaken, muttering about his lost coin and forges, seemingly realizing the true cost of his pursuit of wealth in the face of cosmic events. His legacy remains a cautionary tale of divine power misused for worldly gain.
      `,
    },
    leticia: {
      nickname: "",
      quote:
        "Her red-rimmed eyes burned rather than wept. Fury, not grief, radiated from her.",
      overview:
        "Empress Leticia, of 'House Valaar', became the Imperial Consort to Emperor Jarvan XI. She is the **head of the Order of Eternal Flames**, a religious order that gained immense influence in Galeeria. Originally charming Jarvan XI with her beauty, her true nature as a 'power-hungry schemer' emerged after bearing him three sons. Leticia is the 'ruthless architect of Jarvan XI's murder', framing Kaen for the crime and then attempting to assassinate him at the funeral. She actively despised Kaen, seeking to erase his existence, and was instrumental in having her eldest son, Agon, declared the 'true heir chosen by the gods' by her Order.",
      relations: [
        "Allies: Prince Agon, Prince Sayon, House Valaar, and the Order of Eternal Flames.",
        "Enemies: Kaen, Emperor Jarvan XI (whom she likely conspired against), Empress Emilia (Kaen's mother), Jarvan the Tenth, and Drogo (who opposed her actions).",
      ],
      powers: [
        "Master Manipulator: Her primary strength lies in her ability to orchestrate complex plots, frame innocents, and exploit political and religious influence.",
        "Political Influence: As Imperial Consort and head of the Order of Eternal Flames, she wields significant power over the court, clergy, and public opinion.",
        "Ruthless Ambition:** Her insatiable craving for power drives her destructive actions.",
      ],
      stats: {
        race: "Human",
        age: "Adult/Middle-aged",
        faction:
          "House Valaar, Order of Eternal Flames, Galeerian Imperial Court",
        alignment: "Lawful Evil",
        status: "Alive",
        role: "Imperial Consort, Head of Religious Order, Master Conspirator",
        location: "Imperial Palace, Galeeria",
      },
      trivia: [
        "Her family, House Valaar, rose to prominence from the chaos of Eternea's civil war, ultimately influencing the Galeerian throne through her.",
        "Kaen believes her to be a 'masterpiece of cruelty waltzing hand-in-hand with doom'.",
        "Jarvan X famously scorned Jarvan XI for discarding Emilia for Leticia, calling her a 'venom laced beauty' and condemning the court as a 'menagerie of cowards and jackals' for supporting her.",
      ],
      name: "Empress Leticia",
      slug: "leticia",
      image: "/images/villains/villain-3.jpeg",
      backstory: `The Lure of the Throne and House Valaar's Rise:
    Leticia's rise to power began when Jarvan XI, weary of conflict, married her. Her beauty captivated him, but her ambition soon eclipsed her charm. As a member of House Valaar, which ascended from the ashes of Eternea's civil war and headed the influential Order of Eternal Flames, Leticia brought significant political and religious weight to the imperial court. After giving birth to three sons, her craving for power intensified, leading her Order to declare her firstborn, Agon, as the divinely chosen heir, despite Jarvan XI's reservations about his younger sons.

Conspiracy and Assassination:
     Leticia's cunning and ruthlessness were fully displayed following Emperor Jarvan XI's death. She publicly accused Kaen of patricide, claiming he poisoned his father through a sealed letter. Despite Kaen's pleas of innocence and alibis, she ordered his imprisonment. Immediately after, she orchestrated an assassination attempt on Kaen with a dozen archers during the funeral, revealing her murderous intent. Her coldness and calculated cruelty were evident as she exchanged a knowing glance with Agon, ignoring Drogo's desperate intervention.

Undermining Kaen and The Order's Agenda:
    Leticia consistently worked to undermine Kaen. During the Crown Prince Tournament, she proudly supported Agon, believing him divinely chosen. When Kaen miraculously manifested divine lightning and defeated Agon, her mask of composure shattered. She dismissed his power as an "illusion" and a "spectacle," vowing that the Order of Eternal Flames "will not suffer a storm prince to rule" and would "awaken what has once slumbered" against him. She harbors deep hatred for Kaen, vowing to reduce his "very existence to ash and memory". She was also secretly listening in on the alliance formed between Jarvan XI, Jarvan X, and Kaen, plotting to splinter their pact.`,
    },
    agon: {
      nickname: "",
      quote:
        "My lord father speaks of trials and judgment,” his voice sharp. “But I see no trial here. The gods have already chosen.",
      overview:
        "Prince Agon was the 'eldest son of Empress Leticia and Emperor Jarvan XI', and was widely supported by the court and clergy as the divinely chosen heir. He was an arrogant individual, convinced of his preordained destiny to rule. Agon played a crucial role in the downfall of Kaen, accusing him of patricide and delivering the literal killing blow to Kaen at Jarvan XI's funeral. Despite his perceived divine favor, he was 'humiliatingly defeated' by Kaen during the Crown Prince Tournament when Kaen miraculously awakened his own divine lightning. He represents the entrenched, corrupt power that Kaen seeks to dismantle.",
      relations: [
        "Allies: Empress Leticia (his mother), Order of Eternal Flames, Prince Sayon, and the majority of the court and clergy who supported his claim.",
        "Enemies: Kaen, Drogo (his half-brother, who openly despised him).",
      ],
      powers: [
        "Monstrous Blade: Wielded a large, powerful sword.",
        "Brute Force: Relied on heavy strikes and physical power in combat.",
        "Heavy Armor: Wore armor that, while protective, limited his speed and awareness.",
      ],
      stats: {
        race: "Human",
        age: "Young Adult",
        faction:
          "House Valaar, Order of Eternal Flames, Galeerian Imperial Court",
        alignment: "Lawful Evil",
        status: "Alive",
        role: "Crown Prince",
        location: "Imperial Palace, Galeeria",
      },
      trivia: [
        "He believed himself 'divinely chosen' and the true heir to the Storm Throne before Kaen's miraculous display.",
        "His final words to Kaen, 'You should have bent the knee', before delivering the killing blow, underscore his arrogance.",
        "He is considered by Kaen to be a 'puppet' of his mother.",
      ],
      name: "Prince Agon",
      slug: "agon",
      image: "/images/villains/villain-4.jpeg",
      backstory: `The "Chosen" Heir and Patricide:
     From his birth, Agon was championed by his mother, Empress Leticia, and the powerful Order of Eternal Flames as the "true heir chosen by the gods". This instilled in him an unshakeable belief in his divine right to the throne, leading him to declare that the gods had "already chosen" him even before the Crown Prince Tournament began. He vehemently accused Kaen of poisoning Emperor Jarvan XI, his father, despite Kaen's protests. Agon sealed Kaen's fate at the funeral, personally delivering the fatal dagger blow into Kaen's back while twisting the blade.

Defeat in the Crown Prince Tournament:
     Agon entered the Crown Prince Tournament with overwhelming confidence, fully expecting an uncontested victory after his brothers withdrew. He wielded a "monstrous blade" and was heavily armored, relying on brute force fueled by his rage and conviction. Kaen, however, exploited Agon's blind fury and heavy equipment, enduring his blows until Agon's blade shattered Kaen's. Just as Agon prepared to deliver the killing strike, Kaen's eyes blazed with divine lightning. A blinding bolt from the heavens struck Agon's sword, shattering it and hurling him "smoking, shattered" across the arena, exposing him as a pretender.

Ascension Despite Humiliation:
     Despite his humiliating defeat and exposed vulnerability, Agon became Emperor after Kaen's supposed death. His mother, Leticia, immediately dismissed Kaen's victory as a mere "spectacle" and a "stolen power," vowing that the Order of Eternal Flames would never accept a "storm prince". Agon's reign, therefore, is founded on his mother's manipulation and the murder of his own father and half-brother, a testament to the corruption pervasive in the imperial court [inference from 80, 298].`,
    },
    isolde: {
      nickname: "",
      quote:
        "Isolde believes only in power. Whether it comes from gods, flame, or lies—it matters little. So long as the world bows before it and none dare challenge her crown.",
      overview:
        "Queen Isolde Thalakar is the **ruthless and calculating ruler of Valemyra**, described as impossibly wealthy. She was not born noble but **married into power** and has steadfastly refused to relinquish authority, even to her adult son. Isolde is a master manipulator, famously **inflicting burns on her own son, Teralion**, to perpetuate the illusion that he suffers from the Valeon blood curse. This spectacle allows her to maintain public perception of her divine right to rule and secure obedience through pity and fear. She orchestrated the **abduction and implied torture-death of Sir Anthony** to suppress inconvenient truths about Kaen and the Thalakar lineage. She stands as a formidable antagonist, valuing power above all else.",
      relations: [
        "Allies: Crown Prince Teralion (her son, unwitting victim), palace guards.",
        "Enemies: Reynold (threat to her throne), Duke George (his father), Sir Anthony (whom she eliminated), Kaen (who exposed her), Lucindra (her daughter, who betrayed her). Kaen also implicates Galeeria in her husband's death, implying a shared enemy.",
      ],
      powers: [
        "Master Manipulator and Deceiver: Her primary strength lies in creating and maintaining elaborate illusions and controlling public perception through fear and spectacle.",
        "Vast Wealth and Resources: Controls the Ember Mountains, home to the greatest forge, which generates immense riches and influence. This wealth allows her to control allegiances and maintain power.",
        "Political Authority: As Queen, she commands the palace guards and bureaucracy to enforce her will.",
        "Ruthlessness: Willing to inflict harm on her own son and eliminate perceived threats (like Sir Anthony) to secure her position.",
      ],
      stats: {
        race: "Human",
        age: "Adult/Mature",
        faction: "House Thalakar, Valemyra",
        alignment: "Lawful Evil",
        status: "Alive",
        role: "Queen, Monarch, Master Manipulator",
        location: "Thalakar Palace, Valemont, Valemyra",
      },
      trivia: [
        "Her vast wealth from the Ember Mountains forge is consciously shared with the populace to ensure their loyalty and prevent rebellion, adhering to the principle 'when people eat, and work, and believe, they have no reason rise up'",
        "Kaen, with his newly awakened abilities, can discern the truth behind her son's 'curse' exposing her deep deception",
        "She uses **imperial-grade parchment** for her cryptic communications, indicating a powerful and specific connection to imperial resources, possibly beyond Valemyra itself.",
      ],
      name: "Queen Isolde Thalakar",
      slug: "isolde",
      image: "/images/villains/villain-5.jpeg",
      backstory: `The Ascendancy of Power and Deception:
     Isolde's path to power was through marriage, not birthright, and she has clung to her authority fiercely since her husband's death. To solidify her rule and quell doubts about the Thalakar family's divine mandate, she enacted a cruel deception: she repeatedly inflicted external burns on her own son, Crown Prince Teralion, to simulate the Valeon blood curse. This public display of suffering convinced the populace that divine blood (and curse) still flowed through her line, justifying her continued regency and securing their fear and obedience.

The Elimination of Threats (Sir Anthony and Kaen):
     News of Reynold's miraculous recovery (attributed to Kaen) reached Isolde, threatening her carefully constructed narrative. She summoned Duke George and his party to Valemont, ostensibly for a celebration, but subtly to investigate and control the situation. Sir Anthony, who was investigating Kaen's claims, mysteriously disappeared before the banquet, and the Queen showed no concern, leading Kaen and Duke George to believe she arranged his abduction and subsequent torture-death in the palace dungeons. During a private confrontation, Kaen directly exposed her deception regarding Teralion and accused her of passively allowing her husband, King Thalakar, to be poisoned by Galeerian hands to consolidate her own power.

  A Dangerous Game of Wits and Power:
     Faced with Kaen's dangerous knowledge, Isolde offered him a deal: declare her son healed and parade his "miracle" for the public in exchange for access to the War Council and the forge master. Kaen scoffed at allying with her, calling it an "agreement" instead. He openly threatened to "reduce this throne to ash" if she betrayed him, recognizing her desperation to maintain her illusion. In response, Isolde had Kaen thrown into the dungeon, intending to execute him at dawn, showcasing her ruthlessness and determination to control the narrative.
`,
    },
    "eternal-flames": {
      nickname: "",
      quote:
        "And from its ashes rose House Valaar, head of the Order of Eternal Flames, preaching purity and fire.",
      overview:
        "The Order of Eternal Flames is a 'powerful religious organization' that emerged from the chaos of Eternea's civil war, with **House Valaar** (Empress Leticia's family) at its head. They preach a doctrine of 'purity and fire' which has allowed them to gain immense influence, even reaching the highest echelons of Galeeria's throne. They played a critical role in supporting Prince Agon as the 'true heir chosen by the gods', actively opposing Kaen's claim to the throne and conspiring in his downfall. The Order represents a powerful, corrupt religious force that Kaen, upon his return, vows to dismantle and destroy, stripping them of their wealth, influence, and temples.",
      powers: [
        "Religious Authority:** Their doctrines and declarations are influential, particularly in swaying public opinion and court decisions.",
        "Political Manipulation:** They operate within the imperial court, manipulating events and succession through alliances and accusations.",
        "Wealth and Resources:** As a powerful order, they possess significant wealth which Kaen plans to seize.",
        "Symbolic Fire:** Their rhetoric and philosophy are deeply tied to 'fire' and 'purity'.",
      ],
      relations: [
        "Allies: House Valaar, Empress Leticia, Prince Agon, and the members of the court and clergy who support their doctrine.",
        "Enemies: Kaen, Emperor Jarvan XI, Emperor Jarvan X.",
      ],
      stats: {
        race: "Religious Order (primarily Human members)",
        age: "Centuries old",
        faction: "Religious/Political",
        alignment: "Lawful Evil",
        status: "Active",
        role: "Religious Authority, Political Power Brokers, Usurpers",
        location: "Eternea (origins), Galeeria (main influence)",
      },
      trivia: [
        "They advocate for a rigid, dogmatic faith, in direct opposition to Kaen's secular and pragmatic approach to power.",
        "Their declaration of Agon as 'chosen by the gods' was a deliberate political move to solidify their influence.",
        "The chants 'The Flame dies!' and 'Storm over Sacred Fire!' during Kaen's tournament victory symbolize the clash between the Order and Kaen's new power.",
      ],
      name: "The Order of Eternal Flames",
      slug: "eternal-flames",
      image: "/images/villains/villain-6.jpeg",
      backstory: `Origins and Imperial Influence:
     The Order of Eternal Flames originated in Eternea, rising to prominence through House Valaar after the region succumbed to civil war. Their teachings of "purity and fire" resonated, granting them significant political and social power. This influence culminated when Empress Leticia, from House Valaar, married Emperor Jarvan XI of Galeeria. The Order then officially declared Leticia's firstborn son, Agon, as the "true heir chosen by the gods," cementing their deep ties to the imperial succession.

Opposition to Kaen and Allegations of Witchcraft:
     The Order became a formidable opponent to Kaen. They publicly supported Agon, believing his rule was divinely sanctioned. When Kaen emerged victorious in the Crown Prince Tournament through an unexpected display of divine lightning, the Order swiftly condemned his triumph, accusing him of "witchcraft" and advocating for his impeachment and exile. Empress Leticia, deeply aligned with the Order, vowed they "will not suffer a storm prince to rule" after Kaen's miraculous display, planning to "awaken what has once slumbered" against him.

Kaen's Vow of Annihilation:
     Kaen harbors a deep animosity towards the Order, stemming from their role in his downfall and his father's murder. Upon his reawakening and alliance with his father and grandfather, Kaen articulates a comprehensive plan to destroy them. His decree includes stripping them of land, titles, and temple immunity, freezing their coffers, silencing dissenting priests, and literally watching their temples "burn, brick by sacred brick". This marks the Order of Eternal Flames as a primary target in Kaen's vengeful return to power.`,
    },
    nicolas: {
      nickname: "",
      quote:
        "You whoreson!” Nicolas, a slave overseer with an ugly face and wide shoulders, screamed while running toward the dogs. 'They’re burned!'",
      overview:
        "Nicolas was a 'brutal slave overseer' at Castleberry Farm in Valemyra. He was known for his harsh treatment of the enslaved population, including flogging them. His significant role in the narrative is his **fatal encounter with the reawakened Kaen**. After Kaen accidentally electrocuted Nicolas's hounds, Nicolas attempted to flog him, only to be effortlessly pushed away by Kaen's newfound, unnatural strength, resulting in his neck being snapped. His death marked Kaen's first violent act in his new body and immediately drew attention to his mysterious powers.",
      relations: [
        "Allies: Harald (fellow overseer).",
        "Enemies: Kaen (his killer), and the enslaved individuals he oversaw, such as Jeremiah, who muttered, 'That brute has no soul'.",
      ],
      powers: ["Whip: His primary tool for control and punishment."],
      stats: {
        race: "Human",
        age: "Adult",
        faction: "Castleberry Farm (as an overseer)",
        alignment: "Neutral Evil",
        status: "Deceased",
        role: "Slave Overseer",
        location: "Castleberry Farm, Valemyra",
      },
      trivia: [
        "His death was the first clear demonstration of Kaen's newly acquired, uncontrollable strength and lightning ability.",
        "The swiftness and unnaturalness of his death cemented the fears of the farm workers, leading them to believe Kaen was 'possessed by an ugly spirit' or 'the devil'.",
      ],
      name: "Nicolas",
      slug: "nicolas",
      image: "/images/villains/villain-1.jpeg",
      backstory: `Nicolas was responsible for overseeing the "slaves" at Castleberry Farm, a role he performed with brutality. He owned two large, dark hounds that served him. He was clearly vested in his role and in the control he exerted over the workers, as evidenced by his fury over his dogs and his immediate attempt to punish Kaen.
      Fateful Encounter with Kaen:    Upon Kaen's mysterious reawakening in a new body at Castleberry Farm, he inadvertently killed Nicolas's hounds with a burst of lightning. Enraged, Nicolas lunged at Kaen with a whip, intent on flogging him. However, Kaen, still grappling with his transformed strength, effortlessly caught the whip and with a single "push," sent Nicolas flying into a fence post, snapping his neck and killing him instantly. This shocking death was witnessed by the other workers and immediately stirred whispers of "devil's mark" and "sorcery" around Kaen.`,
    },
    harald: {
      nickname: "",
      quote: "Harald’s voice cracked: “Run! Everyone run!",
      overview:
        "Harald was an **overseer at Castleberry Farm** and a colleague of Nicolas. He stepped in to restore order after Kaen's accidental killing of Nicolas, initially attempting to seize Kaen and dismiss his claims of royalty as 'mumbling nonsense'. However, Harald's true nature, and that of the 'slaves' on the farm, was revealed: they were **trained soldiers in a covert military operation**. Witnessing Kaen's uncontrolled lightning powers, Harald reacted with genuine terror, shouting for everyone to flee. He later confirmed to Kaen that the 'farm' was indeed a 'rebellion disguised' and served the Duke.",
      relations: [
        "Enemies:** Kaen (initially, due to his perceived threat and strangeness).",
        "Allies:** Nicolas (former colleague), Sergeant Anderson, Colonel Merrick, and Duke George's hidden military forces.",
      ],
      powers: [
        "Whip: Carried and used this tool as an overseer.",
        "Soldier Training: Possessed the skills and discipline of a trained soldier.",
      ],
      stats: {
        race: "Human",
        age: "Adult",
        faction: "Duke George's covert military force",
        alignment: "Lawful Neutral",
        status: "Alive",
        role: "Overseer, Soldier",
        location: "Castleberry Farm, Valemyra",
      },
      trivia: [
        "His terrified reaction to Kaen's full display of lightning power was pivotal in showing the raw destructive capability of Kaen's new abilities.",
        "He is one of the characters who inadvertently **confirms the Duke's secret military operations** to Kaen, changing Kaen's understanding of his surroundings from a mere farm to a strategic location.",
      ],
      name: "Harald",
      slug: "harald",
      image: "/images/villains/villain-2.jpeg",
      backstory: `The Overseer and the "Mad Boy": Following Nicolas's death, Harald, as another overseer, took charge. He approached Kaen with questions, attempting to assert authority and dismiss Kaen's claims of being a prince. He believed Kaen was either "possessed by a devil" or "mad". He ordered men to seize Kaen, but they were incapacitated by Kaen's touch.
      Revelation of the Covert Operation: It was during this confrontation that Kaen, with his military acumen, realized Harald and the "slaves" were actually "trained soldiers". Harald confirmed Kaen's suspicions, admitting that Castleberry was a "hidden war camp" and a "rebellion disguised," stating his loyalty to the Duke. This revelation exposed Duke George's secret military preparations, confirming that Harald was not just a farm overseer but a disciplined soldier following orders in a larger, covert operation.`,
    },
    "king-of-deep": {
      nickname: "",
      quote:
        "The King sat regally behind the Queen, his armour dark as the ocean’s depths, crowned with jagged coral and bone. His presence alone commanded absolute authority.",
      overview:
        "The King of the Deep is an ancient ruler who, alongside the Queen of the Deep, is reclaiming lands they held before gods walked Erosea. He commanded absolute authority and was a silent but powerful presence. He and the Queen led monstrous, light-devouring creatures in the 'War of Depths' against the human emperors of Erosea. Their bond is described as a supernaturally coordinated partnership forged before civilization, providing a stark contrast to the disunity of their human adversaries. He was temporarily frozen by Goddess Law's power before vanishing into ash with the Queen",
      powers: [
        "Absolute Authority: His 'presence alone commanded absolute authority'",
        "Command over Deep Creatures: He leads the creatures that caused devastation, which are described as 'half-human, half-sea' and capable of 'devour[ing] light itself'",
        "Supernatural Coordination: Demonstrates 'supernatural' coordination with the Queen, anticipating her movements",
        " Vanishing: Possessed the ability to turn into ash and vanish, alongside the Queen and their creatures",
      ],
      relations: [
        "Ally: The Queen of the Deep – His ancient partner, acting in supernatural coordination",
        "His unnamed creatures/beasts",
        "Nemesis: Goddess Law – The divine entity who intervened to stop their invasion and exerted control over them",
        "Enemies (Reluctant Allies): The Three Emperors of Erosea: Jarvan the First, Valeon, and Crascius Velathor – They were at war with his forces, eventually uniting against him and the Queen",
      ],
      stats: {
        race: "Ancient Being",
        age: "Ancient",
        faction: "The King and Queen of the Deep's forces",
        alignment: "Lawful Evil",
        status:
          "Aligned with the Queen's objective of reclaiming ancestral lands.",
        role: "King, Ancient Ruler",
        location: "The Deep",
      },
      trivia: [
        "His and the Queen's union was scorned by Valeon as a 'shameless display' of love",
        "They collectively symbolized unity, purpose, and strong love, qualities the three warring emperors lacked, making them a significant ideological contrast",
      ],
      name: "King of the deep",
      slug: "king-of-deep",
      image: "/images/villains/king-of-deep.jpeg",
      backstory: `
        Ancient Sovereignty: The King of the Deep, along with the Queen, are ancient rulers of lands held "before gods walked Erosea"
        They emerged from "the deep" to reclaim these territories, leading to widespread environmental devastation across Erosea
        A Partnership Forged in the Abyss: He is consistently depicted as inseparable from the Queen, sitting "regally behind" her
        Under Law's Spell: During Goddess Law's intervention, he, like his forces, was compelled to drop and remain "locked to the ground" by her power
        Their bond is described as a "partnership forged in the abyss of the deep before the dawn of civilization," characterized by supernatural coordination where "when she guides their mount, he anticipates her every shift". This union highlights a profound unity, a quality "the three emperors lack"
        He stayed "still frozen in the dust" even as the Queen broke free of the spell, indicating his stillness or perhaps a different vulnerability to Law's magic compared to the Queen
        Shared Fate: He shared the Queen's ultimate fate, breaking "into ash along with any remaining creature and rode the wind away" in a silent flash`,
    },
    "queen-of-deep": {
      nickname: "",
      quote:
        "The Queen before him was devastatingly beautiful—yet alien—her form both human grace and oceanic monstrosity.",
      overview:
        "The Queen of the Deep is an ancient ruler who, along with the King of the Deep, is reclaiming lands they held before gods walked Erosea. She led monstrous creatures that defied description—half-human, half-sea, capable of devouring light itself. Her invasion caused widespread destruction across Erosea, melting mountains, boiling seas, and spreading deserts. She and her King, serving as formidable opponents, engaged in the 'War of Depths' against the three emperors of Erosea—Jarvan, Valeon, and Crascius. She is portrayed as a powerful, defiant figure who challenges even Goddess Law, maintaining her resolve until her ultimate, self-chosen demise. Her partnership with the King is noted for its supernatural coordination and deep bond, representing a unity and purpose that the warring emperors lacked",
      relations: [
        "Ally: The King of the Deep – Her ancient partner, their bond 'a partnership forged in the abyss of the deep before the dawn of civilization'",
        "Nemesis: Goddess Law – The divine entity who intervened to stop her invasion and tried to force her submission",
        "Enemies (Reluctant Allies): The Three Emperors of Erosea: Jarvan the First, Valeon, and Crascius Velathor – They warred against her forces, eventually uniting to drive her back",
      ],
      powers: [
        "Command over Deep Creatures: Commands 'monsters' that are 'half-human, half-sea' and 'devoured light itself'",
        "Even these 'beasts' reportedly never bowed to her out of fear, suggesting a different kind of loyalty",
        "Supernatural Coordination: Moves 'as one being' with the King of the Deep, their coordination being 'supernatural'",
        "Corruption/Influence: Law implied she was corrupted, stating, 'the corruption suits you'",
        "She could manifest black mist that 'deepened, eating the ground where it touched'",
        "Self-Chosen Demise: Possessed the ability to turn herself (and her King and creatures) into ash and vanish",
      ],
      stats: {
        race: "Ancient Being (Fallen Goddess)",
        age: "Ancient",
        faction: "The King and Queen of the Deep's forces",
        alignment:
          "Appears Chaotic/Self-Serving, driven by a desire to reclaim what she believes is hers",
        status: "Vanished",
        role: "Queen, Ancient Ruler",
        location: "The Deep",
      },
      trivia: [
        "Valeon found her and the King's display of 'love' so 'shameless' that it made him want to vomit",
        "She and the King represented unity, purpose, and a love that makes them stronger, in stark contrast to the three emperors who lacked these qualities",
        "Law accused her of causing their 'doom' and making 'Memory strip the truth from all of us,' suggesting a deeper, forgotten history between them",
        "After her disappearance, Valeon was visibly disturbed, vomiting and muttering about his lost 'coin' and 'forges,' never speaking of the incident again",
      ],
      name: "Queen of the deep",
      slug: "king-of-Queen",
      image: "/images/villains/queen-of-deep.jpeg",
      backstory: `Ancient Dominion and Reclaiming What Is Hers: The Queen and King of the Deep are ancient rulers who existed and held lands before any gods walked Erosea. Their invasion is framed as a reclamation, as the Queen calmly states, "I came for what is mine". 
      Their war, the War of Depths, was so catastrophic it "cracked the world—mountains melted, seas boiled, desert spread like infection". Confrontation with Goddess Law: During the climactic battle, Goddess Law descended to intervene, commanding all to kneel. 
      The Queen of the Deep, however, refused to submit, breaking free from Law's spell. She addressed Law with familiarity, remarking, "All together again. Just like old times," indicating a shared history. Law, in turn, called her "Fallen Goddess Moon" and observed that "the corruption suits you," hinting at a significant transformation or fall. The Queen accused Law of using fear for devotion and causing their "doom" while also claiming that Law made "Memory strip the truth from all of us," though the Queen herself "remembers everything".
      Defiance and Final Act: Despite Law's power and commands, the Queen remained defiant. When Jarvan stepped between her and Law to defend the Goddess, the Queen mocked him, suggesting he would strike Law himself if he remembered their shared past.
      Facing certain defeat or subjugation, she roared, "I kneel to no one and I shall choose how I die!". In a silent flash, she and her King, along with any remaining creatures, turned into ash and rode the wind away, making a final statement of their unyielding will`,
    },
  },
} as const;

const charactersData = [
  {
    name: "Jarvan the First",
    slug: "jarvan",
    image: "/images/characters/joker.jpg",
    description:
      "He ruled Galeeria and corrupted divine power. He outlawed prayer and burned temples, declaring, “The strong rule,” and “The weak pray”. His actions contributed to the world's cracking through clashing powers",
  },
  {
    name: "Jarvan the First",
    slug: "jarvan",
    image: "/images/characters/joker.jpg",
    description:
      "He ruled Galeeria and corrupted divine power. He outlawed prayer and burned temples, declaring, “The strong rule,” and “The weak pray”. His actions contributed to the world's cracking through clashing powers",
  },
  {
    name: "Jarvan the First",
    slug: "jarvan",
    image: "/images/characters/joker.jpg",
    description:
      "He ruled Galeeria and corrupted divine power. He outlawed prayer and burned temples, declaring, “The strong rule,” and “The weak pray”. His actions contributed to the world's cracking through clashing powers",
  },
];

export { quizData, charactersData };
