const quizData = {
  questions: [
    {
      id: 1,
      text: "When power fades, how do you reclaim it?",
      answers: [
        {
          text: "Outwit those who stand above",
          villains: ["leticia", "isolde"],
        },
        {
          text: "Burn the world if I must",
          villains: ["eternal-flames", "agon"],
        },
        {
          text: "Wait in shadows. Patience is my blade",
          villains: ["harald", "queen-of-deep"],
        },
        {
          text: "Proclaim myself chosen. All else unworthy",
          villains: ["agon", "jarvan"],
        },
        {
          text: "Crush the weak, rebuild with what's left",
          villains: ["valeon", "nicolas"],
        },
      ],
    },
    {
      id: 2,
      text: "What would you sacrifice for control?",
      answers: [
        {
          text: "Love. It’s a weakness I buried long ago",
          villains: ["isolde", "queen-of-deep"],
        },
        {
          text: "The lives of countless others",
          villains: ["agon", "eternal-flames"],
        },
        {
          text: "All, even my soul. Only power matters",
          villains: ["harald", "valeon"],
        },
        {
          text: "Nothing. Control is my birthright",
          villains: ["jarvan"],
        },
        {
          text: "Everything. Especially those doubting me",
          villains: ["leticia", "nicolas"],
        },
      ],
    },
    {
      id: 3,
      text: "When confronted with betrayal, how do you respond?",
      answers: [
        {
          text: "Feign ignorance, then twist the knife",
          villain: ["isolde", "leticia"],
        },
        {
          text: "Declare holy vengeance in flames",
          villain: ["eternal-flames", "agon"],
        },
        {
          text: "Vanish and leave nightmares of return",
          villain: ["queen-of-deep"],
        },
        {
          text: "Strike first so none dare betray again",
          villain: ["jarvan"],
        },
        {
          text: "Make them beg and erase their name",
          villain: ["nicolas", "valeon"],
        },
      ],
    },
    {
      id: 4,
      text: "What is and what will be your legacy?",
      answers: [
        {
          text: "Kingdom of shadows, puppets, and lies",
          villain: ["leticia", "isolde"],
        },
        {
          text: "War cry echoing through burning altars",
          villain: ["agon", "eternal-flames"],
        },
        {
          text: "Name erased by gods, returned vengeance",
          villain: ["valeon", "harald"],
        },
        {
          text: "First to silence heaven, last kneeling",
          villain: ["jarvan"],
        },
        {
          text: "None speak kindly, yet remember me",
          villain: ["leticia", "nicolas", "valeon"],
        },
      ],
    },
    {
      id: 5,
      text: "Which words cut deepest into you?",
      answers: [
        {
          text: "The weak pray. The strong rule",
          villain: ["jarvan"],
        },
        { text: "Gold burns brighter than glory.", villain: ["valeon"] },
        { text: "Power is beauty. Beauty is control.", villain: ["leticia"] },
        {
          text: "Let theme believe my pain, to keep my throne.",
          villain: ["isolde"],
        },
        {
          text: "We rose from darkness to reclaim the sun.",
          villain: ["king-of-deep"],
        },
      ],
    },
    {
      id: 6,
      text: "In the end, what you seek?",
      answers: [
        {
          text: "Immortality through legacy and wealth.",
          villain: ["valeon"],
        },
        { text: "Control everything from the shadows.", villain: ["leticia"] },
        {
          text: "To stay in charge, at all cost",
          villain: ["isolde"],
        },
        {
          text: "Become more powerful than the gods",
          villain: ["jarvan"],
        },
        { text: "To feel strong by keeping others weak", villain: ["nicolas"] },
      ],
    },
  ],
  villains: {
    jarvan: {
      slug: "jarvan",
      name: "Jarvan the First",
      nickname: "The Godless Emperor",
      image: "/images/villains/villain-1.jpeg",
      quote: "The strong rule, The weak pray.",
      overview:
        "Jarvan the First was the 'Emperor of Galeeria', one of three rulers who governed Erosea in the Age of Divine Unity. His reign was characterized by a profound **corruption of divine power**, which he manifested by outlawing prayer and burning temples across the frozen north. He famously declared his philosophy, 'The strong rule' and 'The weak pray' embodying a tyrannical approach to governance. His actions, alongside Valeon's, contributed significantly to the **world's fracturing**, causing mountains to melt, seas to boil, and deserts to spread. He is remembered as a **tyrant** whose legacy shaped subsequent rulers and conflicts",
      relations: {
        allies: "Former Allies (Reluctant):** Valeon, Crascius Velathor",
        enemies:
          "The King and Queen of the Deep & Goddess Law (whom he defied)",
      },
      powers: [
        {
          name: "Corrupted Divine Power",
          image: "/images/powers/power-2.jpeg",
          overview: "He fundamentally twisted the nature of divine power.",
        },
        {
          name: "Lightning",
          image: "/images/powers/power-2.jpeg",
          overview:
            "His specific manifestation of divine power, contributing to the 'Trinity' of imperial powers during the War of Depths. His descendant, Kaen, inherits a similar 'storm' ability",
        },
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
      <p>
      The Age of Divine Unity and Corruption:<br/>
      During the Age of Divine Unity, Jarvan the First stood as one of Erosea's three emperors, each uniquely twisting divine power to their will. While Crascius Velathor maintained faith, Jarvan outlawed prayer and destroyed religious sites, proclaiming a doctrine of strength over devotion. This clash of ideologies and powers between him and Crascius, exacerbated by Valeon's profiteering, caused the very fabric of the world to crack, leading to ecological devastation.
      </p>
      <p>
      The War of Depths and Defiance:<br/>
      When monstrous creatures emerged from the deep, threatening all of Erosea, Jarvan the First was compelled to unite with Valeon and Crascius. In this unprecedented alliance, their combined powers—Jarvan's lightning, Valeon's purifying fire, and Crascius's divine flame—drove back the horrors. However, when Goddess Law descended to intervene, commanding all to kneel, Jarvan defiantly remained standing. The Queen of the Deep referred to him as "Storm-Emperor," hinting at his innate connection to tempestuous power, and even implicated him in the unleashing of Law upon themselves. His steadfast defiance marked him, though his voice ultimately broke and never returned after Goddess Law's death in his arms.
      </p>
      `,
    },
    valeon: {
      nickname: "The Coin King",
      quote:
        "He turned his sacred flame into currency, his forges churning steel for any king with gold.",
      overview:
        "Valeon was the 'ruler of Valemyra', the verdant southern lands of Erosea. Unlike his counterparts, Jarvan the First and Crascius Velathor, Valeon's corruption of divine power was rooted in **greed**; he transformed his sacred flame into currency, using his forges to churn out steel for any king willing to pay. He notoriously **profited from the protracted war** between Jarvan and Crascius, contributing to the world's devastation through his mercantile practices. His infamy stems from prioritizing wealth over sacred duty, a choice that ultimately led to his demise from a 'blood curse' that now afflicts his descendants. He is remembered as a 'gold-obsessed emperor'",
      relations: {
        allies:
          "Former Allies (Reluctant):Jarvan the First, Crascius Velathor (during War of Depths)",
        enemies: "The King and Queen of the Deep",
      },
      powers: [
        {
          name: "Sacred Flame",
          image: "/images/powers/power-1.jpeg",
          overview:
            "Purifying Fire: A divine power he possessed and corrupted for monetary gain. This power, when corrupted, led to the blood curse.",
        },
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
      <p>
      The Price of Greed:<br/>
      Valeon was entrusted with the "flame of divine purification," a power meant to cleanse corrupted souls and mend the fractured world. However, he **chose wealth over duty**, transforming this sacred gift into a means of amassing immense riches through commercial enterprises. His forges produced steel for any willing buyer, fueling the wars of his neighbors and profiting from destruction. The gods, displeased with his avarice, exacted a heavy price: Valeon was 'consumed by the very fire he carried', dying from a blood curse that has since plagued his lineage.
      </p>
      <p>
      Reluctant Unity and Tragic End:<br/>
      Despite his self-serving nature, Valeon was forced into a temporary alliance with Jarvan and Crascius during the War of Depths. He expressed visceral disgust at the display of unity and love by the King and Queen of the Deep, which starkly contrasted his own isolation. He contributed his "purifying fire" to the collective effort that drove back the deep creatures. After the Queen of the Deep's demise, Valeon was visibly shaken, muttering about his lost coin and forges, seemingly realizing the true cost of his pursuit of wealth in the face of cosmic events. His legacy remains a cautionary tale of divine power misused for worldly gain.
      </p>
      `,
    },
    leticia: {
      nickname: "The Poison Serpent",
      quote:
        "Her red-rimmed eyes burned rather than wept. Fury, not grief, radiated from her.",
      overview:
        "Empress Leticia, of 'House Valaar', became the Imperial Consort to Emperor Jarvan XI. She is the **head of the Order of Eternal Flames**, a religious order that gained immense influence in Galeeria. Originally charming Jarvan XI with her beauty, her true nature as a 'power-hungry schemer' emerged after bearing him three sons. Leticia is the 'ruthless architect of Jarvan XI's murder', framing Kaen for the crime and then attempting to assassinate him at the funeral. She actively despised Kaen, seeking to erase his existence, and was instrumental in having her eldest son, Agon, declared the 'true heir chosen by the gods' by her Order.",
      relations: {
        allies:
          "Prince Agon, Prince Sayon, House Valaar, and the Order of Eternal Flames.",

        enemies:
          "Kaen, Emperor Jarvan XI (whom she likely conspired against), Empress Emilia (Kaen's mother), Jarvan the Tenth, and Drogo (who opposed her actions).",
      },
      powers: [
        {
          name: "Master Manipulator",
          image: "/images/powers/power-2.jpeg",
          overview:
            "Her primary strength lies in her ability to orchestrate complex plots, frame innocents, and exploit political and religious influence.",
        },
        {
          name: "Political Influence",
          image: "/images/powers/power-3.jpeg",
          overview:
            "As Imperial Consort and head of the Order of Eternal Flames, she wields significant power over the court, clergy, and public opinion",
        },
        {
          name: "Ruthless Ambition",
          image: "/images/powers/power-1.jpeg",
          overview:
            "Her insatiable craving for power drives her destructive actions.",
        },
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
      backstory: `
      <p>
      The Lure of the Throne and House Valaar's Rise:<br/>
      Leticia's rise to power began when Jarvan XI, weary of conflict, married her. Her beauty captivated him, but her ambition soon eclipsed her charm. As a member of House Valaar, which ascended from the ashes of Eternea's civil war and headed the influential Order of Eternal Flames, Leticia brought significant political and religious weight to the imperial court. After giving birth to three sons, her craving for power intensified, leading her Order to declare her firstborn, Agon, as the divinely chosen heir, despite Jarvan XI's reservations about his younger sons.
      </p>
      <p>
      Conspiracy and Assassination:<br/>
      Leticia's cunning and ruthlessness were fully displayed following Emperor Jarvan XI's death. She publicly accused Kaen of patricide, claiming he poisoned his father through a sealed letter. Despite Kaen's pleas of innocence and alibis, she ordered his imprisonment. Immediately after, she orchestrated an assassination attempt on Kaen with a dozen archers during the funeral, revealing her murderous intent. Her coldness and calculated cruelty were evident as she exchanged a knowing glance with Agon, ignoring Drogo's desperate intervention.
      </p>
      <p>
      Undermining Kaen and The Order's Agenda:<br/>
      Leticia consistently worked to undermine Kaen. During the Crown Prince Tournament, she proudly supported Agon, believing him divinely chosen. When Kaen miraculously manifested divine lightning and defeated Agon, her mask of composure shattered. She dismissed his power as an "illusion" and a "spectacle," vowing that the Order of Eternal Flames "will not suffer a storm prince to rule" and would "awaken what has once slumbered" against him. She harbors deep hatred for Kaen, vowing to reduce his "very existence to ash and memory". She was also secretly listening in on the alliance formed between Jarvan XI, Jarvan X, and Kaen, plotting to splinter their pact.
      </p>
      `,
    },
    agon: {
      nickname: "The False Emperor",
      quote:
        "My lord father speaks of trials and judgment,” his voice sharp. “But I see no trial here. The gods have already chosen.",
      overview:
        "Prince Agon was the 'eldest son of Empress Leticia and Emperor Jarvan XI', and was widely supported by the court and clergy as the divinely chosen heir. He was an arrogant individual, convinced of his preordained destiny to rule. Agon played a crucial role in the downfall of Kaen, accusing him of patricide and delivering the literal killing blow to Kaen at Jarvan XI's funeral. Despite his perceived divine favor, he was 'humiliatingly defeated' by Kaen during the Crown Prince Tournament when Kaen miraculously awakened his own divine lightning. He represents the entrenched, corrupt power that Kaen seeks to dismantle.",
      relations: {
        allies:
          "Empress Leticia (his mother), Order of Eternal Flames, Prince Sayon, and the majority of the court and clergy who supported his claim.",

        enemies: "Kaen, Drogo (his half-brother, who openly despised him).",
      },
      powers: [
        {
          name: "Monstrous Blade",
          image: "/images/powers/power-2.jpeg",
          overview: "Wielded a large, powerful sword.",
        },
        {
          name: "Brute Force",
          image: "/images/powers/power-2.jpeg",
          overview: "Relied on heavy strikes and physical power in combat.",
        },
        {
          name: "Heavy Armor",
          image: "/images/powers/power-2.jpeg",
          overview:
            "Wore armor that, while protective, limited his speed and awareness.",
        },
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
      backstory: `
      <p>
      The "Chosen" Heir and Patricide:<br/>
      From his birth, Agon was championed by his mother, Empress Leticia, and the powerful Order of Eternal Flames as the "true heir chosen by the gods". This instilled in him an unshakeable belief in his divine right to the throne, leading him to declare that the gods had "already chosen" him even before the Crown Prince Tournament began. He vehemently accused Kaen of poisoning Emperor Jarvan XI, his father, despite Kaen's protests. Agon sealed Kaen's fate at the funeral, personally delivering the fatal dagger blow into Kaen's back while twisting the blade.
      </p>
      <p>
      Defeat in the Crown Prince Tournament:<br/>
      Agon entered the Crown Prince Tournament with overwhelming confidence, fully expecting an uncontested victory after his brothers withdrew. He wielded a "monstrous blade" and was heavily armored, relying on brute force fueled by his rage and conviction. Kaen, however, exploited Agon's blind fury and heavy equipment, enduring his blows until Agon's blade shattered Kaen's. Just as Agon prepared to deliver the killing strike, Kaen's eyes blazed with divine lightning. A blinding bolt from the heavens struck Agon's sword, shattering it and hurling him "smoking, shattered" across the arena, exposing him as a pretender.
      </p>
      <p>
      Ascension Despite Humiliation:<br/>
      Despite his humiliating defeat and exposed vulnerability, Agon became Emperor after Kaen's supposed death. His mother, Leticia, immediately dismissed Kaen's victory as a mere "spectacle" and a "stolen power," vowing that the Order of Eternal Flames would never accept a "storm prince". Agon's reign, therefore, is founded on his mother's manipulation and the murder of his own father and half-brother, a testament to the corruption pervasive in the imperial court.
      </p>
      `,
    },
    isolde: {
      nickname: "The Iron Monarch",
      quote:
        "Isolde believes only in power. Whether it comes from gods, flame, or lies—it matters little. So long as the world bows before it and none dare challenge her crown.",
      overview:
        "Queen Isolde Thalakar is the **ruthless and calculating ruler of Valemyra**, described as impossibly wealthy. She was not born noble but **married into power** and has steadfastly refused to relinquish authority, even to her adult son. Isolde is a master manipulator, famously **inflicting burns on her own son, Teralion**, to perpetuate the illusion that he suffers from the Valeon blood curse. This spectacle allows her to maintain public perception of her divine right to rule and secure obedience through pity and fear. She orchestrated the **abduction and implied torture-death of Sir Anthony** to suppress inconvenient truths about Kaen and the Thalakar lineage. She stands as a formidable antagonist, valuing power above all else.",
      relations: {
        allies:
          "Crown Prince Teralion (her son, unwitting victim), palace guards.",

        enemies:
          "Reynold (threat to her throne), Duke George (his father), Sir Anthony (whom she eliminated), Kaen (who exposed her), Lucindra (her daughter, who betrayed her). Kaen also implicates Galeeria in her husband's death, implying a shared enemy.",
      },
      powers: [
        {
          name: "Master Deceiver",
          image: "/images/powers/power-2.jpeg",
          overview:
            "Her primary strength lies in creating and maintaining elaborate illusions and controlling public perception through fear and spectacle.",
        },
        {
          name: "Vast Wealth",
          image: "/images/powers/power-2.jpeg",
          overview:
            "Controls the Ember Mountains, home to the greatest forge, which generates immense riches and influence. This wealth allows her to control allegiances and maintain power.",
        },
        {
          name: "Political Authority",
          image: "/images/powers/power-2.jpeg",
          overview:
            "As Queen, she commands the palace guards and bureaucracy to enforce her will.",
        },
        {
          name: "Ruthlessness",
          image: "/images/powers/power-2.jpeg",
          overview:
            "Willing to inflict harm on her own son and eliminate perceived threats (like Sir Anthony) to secure her position.",
        },
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
      backstory: `
      <p>
      The Ascendancy of Power and Deception:<br/>
      Isolde's path to power was through marriage, not birthright, and she has clung to her authority fiercely since her husband's death. To solidify her rule and quell doubts about the Thalakar family's divine mandate, she enacted a cruel deception: she repeatedly inflicted external burns on her own son, Crown Prince Teralion, to simulate the Valeon blood curse. This public display of suffering convinced the populace that divine blood (and curse) still flowed through her line, justifying her continued regency and securing their fear and obedience.
      </p>
      <p>
      The Elimination of Threats (Sir Anthony and Kaen):<br/>
      News of Reynold's miraculous recovery (attributed to Kaen) reached Isolde, threatening her carefully constructed narrative. She summoned Duke George and his party to Valemont, ostensibly for a celebration, but subtly to investigate and control the situation. Sir Anthony, who was investigating Kaen's claims, mysteriously disappeared before the banquet, and the Queen showed no concern, leading Kaen and Duke George to believe she arranged his abduction and subsequent torture-death in the palace dungeons. During a private confrontation, Kaen directly exposed her deception regarding Teralion and accused her of passively allowing her husband, King Thalakar, to be poisoned by Galeerian hands to consolidate her own power.
      </p>
      <p>
      A Dangerous Game of Wits and Power:<br/>
      Faced with Kaen's dangerous knowledge, Isolde offered him a deal: declare her son healed and parade his "miracle" for the public in exchange for access to the War Council and the forge master. Kaen scoffed at allying with her, calling it an "agreement" instead. He openly threatened to "reduce this throne to ash" if she betrayed him, recognizing her desperation to maintain her illusion. In response, Isolde had Kaen thrown into the dungeon, intending to execute him at dawn, showcasing her ruthlessness and determination to control the narrative.
      </p>
`,
    },
    "eternal-flames": {
      nickname: "The Burning Cult",
      quote: "From ashes rose House Valaar, preaching purity and fire.",
      overview:
        "The Order of Eternal Flames is a 'powerful religious organization' that emerged from the chaos of Eternea's civil war, with **House Valaar** (Empress Leticia's family) at its head. They preach a doctrine of 'purity and fire' which has allowed them to gain immense influence, even reaching the highest echelons of Galeeria's throne. They played a critical role in supporting Prince Agon as the 'true heir chosen by the gods', actively opposing Kaen's claim to the throne and conspiring in his downfall. The Order represents a powerful, corrupt religious force that Kaen, upon his return, vows to dismantle and destroy, stripping them of their wealth, influence, and temples.",
      powers: [
        {
          name: "Religious Authority",
          image: "/images/powers/power-2.jpeg",
          overview:
            "Their doctrines and declarations are influential, particularly in swaying public opinion and court decisions.",
        },
        {
          name: "Political Manipulation",
          image: "/images/powers/power-1.jpeg",
          overview:
            "They operate within the imperial court, manipulating events and succession through alliances and accusations.",
        },
        {
          name: "Wealth and Resources",
          image: "/images/powers/power-3.jpeg",
          overview:
            "As a powerful order, they possess significant wealth which Kaen plans to seize.",
        },
        {
          name: "Symbolic Fire",
          image: "/images/powers/power-4.jpeg",
          overview:
            "Their rhetoric and philosophy are deeply tied to 'fire' and 'purity'.",
        },
      ],
      relations: {
        allies:
          "House Valaar, Empress Leticia, Prince Agon, and the members of the court and clergy who support their doctrine.",

        enemies: "Kaen, Emperor Jarvan XI, Emperor Jarvan X.",
      },

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
      backstory: `
        <p>
          They say the Order of Eternal Flames was forged in the ashes of Eternea’s civil war, its roots twined around the ambitions of House Valaar. Preaching purity through fire, they became more than a creed—they became a blade hidden within the empire’s heart. When Leticia of Valaar took the throne beside Emperor Jarvan XI, the Order’s reach deepened. From temple steps to imperial chambers, their word became law. It was they who named Leticia’s firstborn, Agon, the true heir chosen by the gods, binding the bloodline to their will.
        </p>
        <p>
          But in the shadows of their sanctity, they marked another as heretic—Kaen, the storm-born prince. His victory in the Crown Prince Tournament was a thunderclap the realm could not ignore: lightning summoned by his own hand, divine and undeniable. Yet the Order called it witchcraft. Their priests cried for his ruin, and Empress Leticia, their most fervent flame, vowed that “no storm prince shall rule.” She spoke of waking what should have stayed buried, a weapon to shatter him.
        </p>
        <p>
          The tale darkens from there. The prince was cast down, his father slain, the Order’s blessing sealing the crime. But death was not Kaen’s end. Returned from shadow with father and grandsire beside him, his vengeance was scripture in its own right: strip the Order of lands, titles, and divine immunity; starve their coffers; silence their priests; and set their temples to the pyre—brick by sacred brick. In his decree, the Order was no longer the empire’s guiding flame, but kindling awaiting the match.
        </p>
        `,
    },
    nicolas: {
      nickname: "The Iron Monarch",
      quote:
        "You whoreson!” Nicolas, a slave overseer with an ugly face and wide shoulders, screamed while running toward the dogs. 'They’re burned!'",
      overview:
        "Nicolas was a 'brutal slave overseer' at Castleberry Farm in Valemyra. He was known for his harsh treatment of the enslaved population, including flogging them. His significant role in the narrative is his **fatal encounter with the reawakened Kaen**. After Kaen accidentally electrocuted Nicolas's hounds, Nicolas attempted to flog him, only to be effortlessly pushed away by Kaen's newfound, unnatural strength, resulting in his neck being snapped. His death marked Kaen's first violent act in his new body and immediately drew attention to his mysterious powers.",
      relations: {
        allies: "Harald (fellow overseer).",
        enemies:
          "Kaen (his killer), and the enslaved individuals he oversaw, such as Jeremiah, who muttered, 'That brute has no soul'.",
      },
      powers: [
        {
          name: "Whip",
          image: "/images/powers/power-2.jpeg",
          overview: "His primary tool for control and punishment.",
        },
      ],
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
      backstory: `
      <p>
      Nicolas was responsible for overseeing the "slaves" at Castleberry Farm, a role he performed with brutality. He owned two large, dark hounds that served him. He was clearly vested in his role and in the control he exerted over the workers, as evidenced by his fury over his dogs and his immediate attempt to punish Kaen.
      </p>
      <p>
      Fateful Encounter with Kaen:<br/>
      Upon Kaen's mysterious reawakening in a new body at Castleberry Farm, he inadvertently killed Nicolas's hounds with a burst of lightning. Enraged, Nicolas lunged at Kaen with a whip, intent on flogging him. However, Kaen, still grappling with his transformed strength, effortlessly caught the whip and with a single "push," sent Nicolas flying into a fence post, snapping his neck and killing him instantly. This shocking death was witnessed by the other workers and immediately stirred whispers of "devil's mark" and "sorcery" around Kaen.
      </p>
      `,
    },
    harald: {
      nickname: "The overseer",
      quote: "Harald’s voice cracked: “Run! Everyone run!",
      overview:
        "Harald was an **overseer at Castleberry Farm** and a colleague of Nicolas. He stepped in to restore order after Kaen's accidental killing of Nicolas, initially attempting to seize Kaen and dismiss his claims of royalty as 'mumbling nonsense'. However, Harald's true nature, and that of the 'slaves' on the farm, was revealed: they were **trained soldiers in a covert military operation**. Witnessing Kaen's uncontrolled lightning powers, Harald reacted with genuine terror, shouting for everyone to flee. He later confirmed to Kaen that the 'farm' was indeed a 'rebellion disguised' and served the Duke.",

      relations: {
        allies:
          "Nicolas (former colleague), Sergeant Anderson, Colonel Merrick, and Duke George's hidden military forces.",

        enemies:
          "Kaen (initially, due to his perceived threat and strangeness).",
      },
      powers: [
        {
          name: "Whip",
          image: "/images/powers/power-2.jpeg",
          overview: "Carried and used this tool as an overseer.",
        },
        {
          name: "Soldier Training",
          image: "/images/powers/power-2.jpeg",
          overview: "Possessed the skills and discipline of a trained soldier.",
        },
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
      backstory: `
      <p>
      The Overseer and the "Mad Boy":<br/>
      Following Nicolas's death, Harald, as another overseer, took charge. He approached Kaen with questions, attempting to assert authority and dismiss Kaen's claims of being a prince. He believed Kaen was either "possessed by a devil" or "mad". He ordered men to seize Kaen, but they were incapacitated by Kaen's touch.
      </p>
      <p>
      Revelation of the Covert Operation:<br/>
      It was during this confrontation that Kaen, with his military acumen, realized Harald and the "slaves" were actually "trained soldiers". Harald confirmed Kaen's suspicions, admitting that Castleberry was a "hidden war camp" and a "rebellion disguised," stating his loyalty to the Duke. This revelation exposed Duke George's secret military preparations, confirming that Harald was not just a farm overseer but a disciplined soldier following orders in a larger, covert operation.
      </p>
      `,
    },
    "king-of-deep": {
      nickname: "The Abyssal King",
      quote:
        "The King sat regally behind the Queen, his armour dark as the ocean’s depths, crowned with jagged coral and bone. His presence alone commanded absolute authority.",
      overview:
        "The King of the Deep is an ancient ruler who, alongside the Queen of the Deep, is reclaiming lands they held before gods walked Erosea. He commanded absolute authority and was a silent but powerful presence. He and the Queen led monstrous, light-devouring creatures in the 'War of Depths' against the human emperors of Erosea. Their bond is described as a supernaturally coordinated partnership forged before civilization, providing a stark contrast to the disunity of their human adversaries. He was temporarily frozen by Goddess Law's power before vanishing into ash with the Queen",
      powers: [
        {
          name: "Absolute Authority",
          image: "/images/powers/power-2.jpeg",
          overview: "His 'presence alone commanded absolute authority'",
        },
        {
          name: "Command over Deep Creatures",
          image: "/images/powers/power-2.jpeg",
          overview:
            "He leads the creatures that caused devastation, which are described as 'half-human, half-sea' and capable of 'devour[ing] light itself'",
        },
        {
          name: "Supernatural Coordination",
          image: "/images/powers/power-2.jpeg",
          overview:
            "Demonstrates 'supernatural' coordination with the Queen, anticipating her movements",
        },
        {
          name: "Vanishing",
          image: "/images/powers/power-2.jpeg",
          overview:
            "Possessed the ability to turn into ash and vanish, alongside the Queen and their creatures",
        },
      ],
      relations: {
        allies:
          "The Queen of the Deep – His ancient partner, acting in supernatural coordination & His unnamed creatures/beasts",

        enemies:
          "Nemesis: Goddess Law – The divine entity who intervened to stop their invasion and exerted control over them and (Reluctant Allies): The Three Emperors of Erosea: Jarvan the First, Valeon, and Crascius Velathor – They were at war with his forces, eventually uniting against him and the Queen",
      },
      stats: {
        race: "Ancient Being",
        age: "Ancient",
        faction: "The King & Queen of the Deep's forces",
        alignment: "Lawful Evil/Aligned with the Queen of the deep",
        status: "Vanished",
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
        <p>
        Ancient Sovereignty:<br/>
        The King of the Deep, along with the Queen, are ancient rulers of lands held "before gods walked Erosea"
        They emerged from "the deep" to reclaim these territories, leading to widespread environmental devastation across Erosea
        A Partnership Forged in the Abyss: He is consistently depicted as inseparable from the Queen, sitting "regally behind" her.<br/>
        </p>
        <p>
        Under Law's Spell:<br/>
        During Goddess Law's intervention, he, like his forces, was compelled to drop and remain "locked to the ground" by her power
        Their bond is described as a "partnership forged in the abyss of the deep before the dawn of civilization," characterized by supernatural coordination where "when she guides their mount, he anticipates her every shift". This union highlights a profound unity, a quality "the three emperors lack"
        He stayed "still frozen in the dust" even as the Queen broke free of the spell, indicating his stillness or perhaps a different vulnerability to Law's magic compared to the Queen.<br/>
        </p>
        <p>
        Shared Fate: <br/>
        He shared the Queen's ultimate fate, breaking "into ash along with any remaining creature and rode the wind away" in a silent flash
        </p>
        `,
    },
    "queen-of-deep": {
      nickname: "The Fallen Goddess",
      quote: "She was devastatingly beautiful yet alien",
      overview:
        "The Queen of the Deep, ancient sovereign beside her King, seeks to reclaim the realms they ruled before gods walked Erosea. Commanding indescribable sea-spawn that devoured light, she brought devastation—melting mountains, boiling seas, and turning lands to desert—until clashing with the three emperors in the War of Depths. Defiant even before Goddess Law, she chose her fate, her bond with the King as unyielding as the abyss itself.",

      relations: {
        allies:
          "The King of the Deep – Her ancient partner, their bond 'a partnership forged in the abyss of the deep before the dawn of civilization'",

        enemies:
          "Nemesis: Goddess Law – The divine entity who intervened to stop her invasion and tried to force her submission &(Reluctant Allies): The Three Emperors of Erosea: Jarvan the First, Valeon, and Crascius Velathor – They warred against her forces, eventually uniting to drive her back",
      },
      powers: [
        {
          name: "Command over Deep Creatures",
          image: "/images/powers/power-2.jpeg",
          overview:
            "Commands 'monsters' that are 'half-human, half-sea' and 'devoured light itself'",
        },
        {
          name: "Supernatural Coordination",
          image: "/images/powers/power-2.jpeg",
          overview:
            "Possessed the ability to turn into ash and vanish, alongside the Queen and their creatures",
        },
        {
          name: "Corruption/Influence",
          image: "/images/powers/power-2.jpeg",
          overview:
            "Law implied she was corrupted, stating, 'the corruption suits you'",
        },
        {
          name: "black mist",
          image: "/images/powers/power-2.jpeg",
          overview:
            "She could manifest black mist that 'deepened, eating the ground where it touched'",
        },
      ],
      stats: {
        race: "Ancient Being (Fallen Goddess)",
        age: "Ancient",
        faction: "The King & Queen of the Deep's forces",
        alignment: "Chaotic/Self-Serving",
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
      backstory: `
      <p>
        The Queen and King of the Deep were sovereigns of an age before gods walked Erosea, their dominion spanning realms now long claimed by others. When they rose from the abyss, it was not as conquerors, but as heirs reclaiming what had always been theirs. The Queen’s words were calm, almost serene: “I came for what is mine.” Yet the war they waged—the War of Depths—was anything but tranquil. It shattered the world itself: mountains melted, seas boiled, and deserts spread like a slow, festering wound.
      </p>
      <p>
        At the height of the conflict, Goddess Law descended in blinding radiance, her voice an unshakable command for all to kneel. The Queen did not. She shattered the divine spell and regarded the goddess with a voice edged in memory: “All together again. Just like old times.” Law’s reply was cold and telling—“Fallen Goddess Moon. The corruption suits you.” In those words lay the shadow of a great fall, a shared history buried by time. The Queen accused Law of ruling through fear, of orchestrating their doom, and of forcing Memory itself to strip truth from the world. But she, unlike the others, remembered everything.
      </p>
      <p>
        Even as defeat closed in, the Queen’s defiance only deepened. When Jarvan stepped between her and Law, sworn to protect the goddess, she mocked him with the cruel certainty that if he remembered their past, he too would turn his blade against Law. With no path left but surrender, she chose otherwise. Her roar split the air: “I kneel to no one—and I shall choose how I die!” In a blinding flash, she and her King, along with the last of their abyssal kin, dissolved into ash and scattered upon the wind—leaving only the echo of their unyielding will.
      </p>
      `,
    },
  },
} as const;

const charactersData = {
  jarvan: {
    slug: "jarvan",
    name: "Jarvan the First",
    nickname: "The Godless Emperor",
    image: "/images/villains/villain-1.jpeg",
    quote: "The strong rule, The weak pray.",
    overview:
      "Jarvan the First was the 'Emperor of Galeeria', one of three rulers who governed Erosea in the Age of Divine Unity. His reign was characterized by a profound **corruption of divine power**, which he manifested by outlawing prayer and burning temples across the frozen north. He famously declared his philosophy, 'The strong rule' and 'The weak pray' embodying a tyrannical approach to governance. His actions, alongside Valeon's, contributed significantly to the **world's fracturing**, causing mountains to melt, seas to boil, and deserts to spread. He is remembered as a **tyrant** whose legacy shaped subsequent rulers and conflicts",
    relations: {
      allies: "Former Allies (Reluctant):** Valeon, Crascius Velathor",
      enemies: "The King and Queen of the Deep & Goddess Law (whom he defied)",
    },
    powers: [
      {
        name: "Corrupted Divine Power",
        image: "/images/powers/power-2.jpeg",
        overview: "He fundamentally twisted the nature of divine power.",
      },
      {
        name: "Lightning",
        image: "/images/powers/power-2.jpeg",
        overview:
          "His specific manifestation of divine power, contributing to the 'Trinity' of imperial powers during the War of Depths. His descendant, Kaen, inherits a similar 'storm' ability",
      },
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
    <p>
    The Age of Divine Unity and Corruption:<br/>
    During the Age of Divine Unity, Jarvan the First stood as one of Erosea's three emperors, each uniquely twisting divine power to their will. While Crascius Velathor maintained faith, Jarvan outlawed prayer and destroyed religious sites, proclaiming a doctrine of strength over devotion. This clash of ideologies and powers between him and Crascius, exacerbated by Valeon's profiteering, caused the very fabric of the world to crack, leading to ecological devastation.
    </p>
    <p>
    The War of Depths and Defiance:<br/>
    When monstrous creatures emerged from the deep, threatening all of Erosea, Jarvan the First was compelled to unite with Valeon and Crascius. In this unprecedented alliance, their combined powers—Jarvan's lightning, Valeon's purifying fire, and Crascius's divine flame—drove back the horrors. However, when Goddess Law descended to intervene, commanding all to kneel, Jarvan defiantly remained standing. The Queen of the Deep referred to him as "Storm-Emperor," hinting at his innate connection to tempestuous power, and even implicated him in the unleashing of Law upon themselves. His steadfast defiance marked him, though his voice ultimately broke and never returned after Goddess Law's death in his arms.
    </p>
    `,
  },
  valeon: {
    nickname: "The Coin King",
    quote:
      "He turned his sacred flame into currency, his forges churning steel for any king with gold.",
    overview:
      "Valeon was the 'ruler of Valemyra', the verdant southern lands of Erosea. Unlike his counterparts, Jarvan the First and Crascius Velathor, Valeon's corruption of divine power was rooted in **greed**; he transformed his sacred flame into currency, using his forges to churn out steel for any king willing to pay. He notoriously **profited from the protracted war** between Jarvan and Crascius, contributing to the world's devastation through his mercantile practices. His infamy stems from prioritizing wealth over sacred duty, a choice that ultimately led to his demise from a 'blood curse' that now afflicts his descendants. He is remembered as a 'gold-obsessed emperor'",
    relations: {
      allies:
        "Former Allies (Reluctant):Jarvan the First, Crascius Velathor (during War of Depths)",
      enemies: "The King and Queen of the Deep",
    },
    powers: [
      {
        name: "Sacred Flame",
        image: "/images/powers/power-1.jpeg",
        overview:
          "Purifying Fire: A divine power he possessed and corrupted for monetary gain. This power, when corrupted, led to the blood curse.",
      },
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
    <p>
    The Price of Greed:<br/>
    Valeon was entrusted with the "flame of divine purification," a power meant to cleanse corrupted souls and mend the fractured world. However, he **chose wealth over duty**, transforming this sacred gift into a means of amassing immense riches through commercial enterprises. His forges produced steel for any willing buyer, fueling the wars of his neighbors and profiting from destruction. The gods, displeased with his avarice, exacted a heavy price: Valeon was 'consumed by the very fire he carried', dying from a blood curse that has since plagued his lineage.
    </p>
    <p>
    Reluctant Unity and Tragic End:<br/>
    Despite his self-serving nature, Valeon was forced into a temporary alliance with Jarvan and Crascius during the War of Depths. He expressed visceral disgust at the display of unity and love by the King and Queen of the Deep, which starkly contrasted his own isolation. He contributed his "purifying fire" to the collective effort that drove back the deep creatures. After the Queen of the Deep's demise, Valeon was visibly shaken, muttering about his lost coin and forges, seemingly realizing the true cost of his pursuit of wealth in the face of cosmic events. His legacy remains a cautionary tale of divine power misused for worldly gain.
    </p>
    `,
  },
  leticia: {
    nickname: "The Poison Serpent",
    quote:
      "Her red-rimmed eyes burned rather than wept. Fury, not grief, radiated from her.",
    overview:
      "Empress Leticia, of 'House Valaar', became the Imperial Consort to Emperor Jarvan XI. She is the **head of the Order of Eternal Flames**, a religious order that gained immense influence in Galeeria. Originally charming Jarvan XI with her beauty, her true nature as a 'power-hungry schemer' emerged after bearing him three sons. Leticia is the 'ruthless architect of Jarvan XI's murder', framing Kaen for the crime and then attempting to assassinate him at the funeral. She actively despised Kaen, seeking to erase his existence, and was instrumental in having her eldest son, Agon, declared the 'true heir chosen by the gods' by her Order.",
    relations: {
      allies:
        "Prince Agon, Prince Sayon, House Valaar, and the Order of Eternal Flames.",

      enemies:
        "Kaen, Emperor Jarvan XI (whom she likely conspired against), Empress Emilia (Kaen's mother), Jarvan the Tenth, and Drogo (who opposed her actions).",
    },
    powers: [
      {
        name: "Master Manipulator",
        image: "/images/powers/power-2.jpeg",
        overview:
          "Her primary strength lies in her ability to orchestrate complex plots, frame innocents, and exploit political and religious influence.",
      },
      {
        name: "Political Influence",
        image: "/images/powers/power-3.jpeg",
        overview:
          "As Imperial Consort and head of the Order of Eternal Flames, she wields significant power over the court, clergy, and public opinion",
      },
      {
        name: "Ruthless Ambition",
        image: "/images/powers/power-1.jpeg",
        overview:
          "Her insatiable craving for power drives her destructive actions.",
      },
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
    backstory: `
    <p>
    The Lure of the Throne and House Valaar's Rise:<br/>
    Leticia's rise to power began when Jarvan XI, weary of conflict, married her. Her beauty captivated him, but her ambition soon eclipsed her charm. As a member of House Valaar, which ascended from the ashes of Eternea's civil war and headed the influential Order of Eternal Flames, Leticia brought significant political and religious weight to the imperial court. After giving birth to three sons, her craving for power intensified, leading her Order to declare her firstborn, Agon, as the divinely chosen heir, despite Jarvan XI's reservations about his younger sons.
    </p>
    <p>
    Conspiracy and Assassination:<br/>
    Leticia's cunning and ruthlessness were fully displayed following Emperor Jarvan XI's death. She publicly accused Kaen of patricide, claiming he poisoned his father through a sealed letter. Despite Kaen's pleas of innocence and alibis, she ordered his imprisonment. Immediately after, she orchestrated an assassination attempt on Kaen with a dozen archers during the funeral, revealing her murderous intent. Her coldness and calculated cruelty were evident as she exchanged a knowing glance with Agon, ignoring Drogo's desperate intervention.
    </p>
    <p>
    Undermining Kaen and The Order's Agenda:<br/>
    Leticia consistently worked to undermine Kaen. During the Crown Prince Tournament, she proudly supported Agon, believing him divinely chosen. When Kaen miraculously manifested divine lightning and defeated Agon, her mask of composure shattered. She dismissed his power as an "illusion" and a "spectacle," vowing that the Order of Eternal Flames "will not suffer a storm prince to rule" and would "awaken what has once slumbered" against him. She harbors deep hatred for Kaen, vowing to reduce his "very existence to ash and memory". She was also secretly listening in on the alliance formed between Jarvan XI, Jarvan X, and Kaen, plotting to splinter their pact.
    </p>
    `,
  },
  agon: {
    nickname: "The False Emperor",
    quote:
      "My lord father speaks of trials and judgment,” his voice sharp. “But I see no trial here. The gods have already chosen.",
    overview:
      "Prince Agon was the 'eldest son of Empress Leticia and Emperor Jarvan XI', and was widely supported by the court and clergy as the divinely chosen heir. He was an arrogant individual, convinced of his preordained destiny to rule. Agon played a crucial role in the downfall of Kaen, accusing him of patricide and delivering the literal killing blow to Kaen at Jarvan XI's funeral. Despite his perceived divine favor, he was 'humiliatingly defeated' by Kaen during the Crown Prince Tournament when Kaen miraculously awakened his own divine lightning. He represents the entrenched, corrupt power that Kaen seeks to dismantle.",
    relations: {
      allies:
        "Empress Leticia (his mother), Order of Eternal Flames, Prince Sayon, and the majority of the court and clergy who supported his claim.",

      enemies: "Kaen, Drogo (his half-brother, who openly despised him).",
    },
    powers: [
      {
        name: "Monstrous Blade",
        image: "/images/powers/power-2.jpeg",
        overview: "Wielded a large, powerful sword.",
      },
      {
        name: "Brute Force",
        image: "/images/powers/power-2.jpeg",
        overview: "Relied on heavy strikes and physical power in combat.",
      },
      {
        name: "Heavy Armor",
        image: "/images/powers/power-2.jpeg",
        overview:
          "Wore armor that, while protective, limited his speed and awareness.",
      },
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
    backstory: `
    <p>
    The "Chosen" Heir and Patricide:<br/>
    From his birth, Agon was championed by his mother, Empress Leticia, and the powerful Order of Eternal Flames as the "true heir chosen by the gods". This instilled in him an unshakeable belief in his divine right to the throne, leading him to declare that the gods had "already chosen" him even before the Crown Prince Tournament began. He vehemently accused Kaen of poisoning Emperor Jarvan XI, his father, despite Kaen's protests. Agon sealed Kaen's fate at the funeral, personally delivering the fatal dagger blow into Kaen's back while twisting the blade.
    </p>
    <p>
    Defeat in the Crown Prince Tournament:<br/>
    Agon entered the Crown Prince Tournament with overwhelming confidence, fully expecting an uncontested victory after his brothers withdrew. He wielded a "monstrous blade" and was heavily armored, relying on brute force fueled by his rage and conviction. Kaen, however, exploited Agon's blind fury and heavy equipment, enduring his blows until Agon's blade shattered Kaen's. Just as Agon prepared to deliver the killing strike, Kaen's eyes blazed with divine lightning. A blinding bolt from the heavens struck Agon's sword, shattering it and hurling him "smoking, shattered" across the arena, exposing him as a pretender.
    </p>
    <p>
    Ascension Despite Humiliation:<br/>
    Despite his humiliating defeat and exposed vulnerability, Agon became Emperor after Kaen's supposed death. His mother, Leticia, immediately dismissed Kaen's victory as a mere "spectacle" and a "stolen power," vowing that the Order of Eternal Flames would never accept a "storm prince". Agon's reign, therefore, is founded on his mother's manipulation and the murder of his own father and half-brother, a testament to the corruption pervasive in the imperial court.
    </p>
    `,
  },
  isolde: {
    nickname: "The Iron Monarch",
    quote:
      "Isolde believes only in power. Whether it comes from gods, flame, or lies—it matters little. So long as the world bows before it and none dare challenge her crown.",
    overview:
      "Queen Isolde Thalakar is the **ruthless and calculating ruler of Valemyra**, described as impossibly wealthy. She was not born noble but **married into power** and has steadfastly refused to relinquish authority, even to her adult son. Isolde is a master manipulator, famously **inflicting burns on her own son, Teralion**, to perpetuate the illusion that he suffers from the Valeon blood curse. This spectacle allows her to maintain public perception of her divine right to rule and secure obedience through pity and fear. She orchestrated the **abduction and implied torture-death of Sir Anthony** to suppress inconvenient truths about Kaen and the Thalakar lineage. She stands as a formidable antagonist, valuing power above all else.",
    relations: {
      allies:
        "Crown Prince Teralion (her son, unwitting victim), palace guards.",

      enemies:
        "Reynold (threat to her throne), Duke George (his father), Sir Anthony (whom she eliminated), Kaen (who exposed her), Lucindra (her daughter, who betrayed her). Kaen also implicates Galeeria in her husband's death, implying a shared enemy.",
    },
    powers: [
      {
        name: "Master Deceiver",
        image: "/images/powers/power-2.jpeg",
        overview:
          "Her primary strength lies in creating and maintaining elaborate illusions and controlling public perception through fear and spectacle.",
      },
      {
        name: "Vast Wealth",
        image: "/images/powers/power-2.jpeg",
        overview:
          "Controls the Ember Mountains, home to the greatest forge, which generates immense riches and influence. This wealth allows her to control allegiances and maintain power.",
      },
      {
        name: "Political Authority",
        image: "/images/powers/power-2.jpeg",
        overview:
          "As Queen, she commands the palace guards and bureaucracy to enforce her will.",
      },
      {
        name: "Ruthlessness",
        image: "/images/powers/power-2.jpeg",
        overview:
          "Willing to inflict harm on her own son and eliminate perceived threats (like Sir Anthony) to secure her position.",
      },
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
    backstory: `
    <p>
    The Ascendancy of Power and Deception:<br/>
    Isolde's path to power was through marriage, not birthright, and she has clung to her authority fiercely since her husband's death. To solidify her rule and quell doubts about the Thalakar family's divine mandate, she enacted a cruel deception: she repeatedly inflicted external burns on her own son, Crown Prince Teralion, to simulate the Valeon blood curse. This public display of suffering convinced the populace that divine blood (and curse) still flowed through her line, justifying her continued regency and securing their fear and obedience.
    </p>
    <p>
    The Elimination of Threats (Sir Anthony and Kaen):<br/>
    News of Reynold's miraculous recovery (attributed to Kaen) reached Isolde, threatening her carefully constructed narrative. She summoned Duke George and his party to Valemont, ostensibly for a celebration, but subtly to investigate and control the situation. Sir Anthony, who was investigating Kaen's claims, mysteriously disappeared before the banquet, and the Queen showed no concern, leading Kaen and Duke George to believe she arranged his abduction and subsequent torture-death in the palace dungeons. During a private confrontation, Kaen directly exposed her deception regarding Teralion and accused her of passively allowing her husband, King Thalakar, to be poisoned by Galeerian hands to consolidate her own power.
    </p>
    <p>
    A Dangerous Game of Wits and Power:<br/>
    Faced with Kaen's dangerous knowledge, Isolde offered him a deal: declare her son healed and parade his "miracle" for the public in exchange for access to the War Council and the forge master. Kaen scoffed at allying with her, calling it an "agreement" instead. He openly threatened to "reduce this throne to ash" if she betrayed him, recognizing her desperation to maintain her illusion. In response, Isolde had Kaen thrown into the dungeon, intending to execute him at dawn, showcasing her ruthlessness and determination to control the narrative.
    </p>
`,
  },
  "eternal-flames": {
    nickname: "The Burning Cult",
    quote: "From ashes rose House Valaar, preaching purity and fire.",
    overview:
      "The Order of Eternal Flames is a 'powerful religious organization' that emerged from the chaos of Eternea's civil war, with **House Valaar** (Empress Leticia's family) at its head. They preach a doctrine of 'purity and fire' which has allowed them to gain immense influence, even reaching the highest echelons of Galeeria's throne. They played a critical role in supporting Prince Agon as the 'true heir chosen by the gods', actively opposing Kaen's claim to the throne and conspiring in his downfall. The Order represents a powerful, corrupt religious force that Kaen, upon his return, vows to dismantle and destroy, stripping them of their wealth, influence, and temples.",
    powers: [
      {
        name: "Religious Authority",
        image: "/images/powers/power-1.jpeg",
        overview:
          "Their doctrines and declarations are influential, particularly in swaying public opinion and court decisions.",
      },
      {
        name: "Political Manipulation",
        image: "/images/powers/power-2.jpeg",
        overview:
          "They operate within the imperial court, manipulating events and succession through alliances and accusations.",
      },
      {
        name: "Wealth and Resources",
        image: "/images/powers/power-3.jpeg",
        overview:
          "As a powerful order, they possess significant wealth which Kaen plans to seize.",
      },
      {
        name: "Symbolic Fire",
        image: "/images/powers/power-4.jpeg",
        overview:
          "Their rhetoric and philosophy are deeply tied to 'fire' and 'purity'.",
      },
    ],
    relations: {
      allies:
        "House Valaar, Empress Leticia, Prince Agon, and the members of the court and clergy who support their doctrine.",

      enemies: "Kaen, Emperor Jarvan XI, Emperor Jarvan X.",
    },

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
    backstory: `
      <p>
        They say the Order of Eternal Flames was forged in the ashes of Eternea’s civil war, its roots twined around the ambitions of House Valaar. Preaching purity through fire, they became more than a creed—they became a blade hidden within the empire’s heart. When Leticia of Valaar took the throne beside Emperor Jarvan XI, the Order’s reach deepened. From temple steps to imperial chambers, their word became law. It was they who named Leticia’s firstborn, Agon, the true heir chosen by the gods, binding the bloodline to their will.
      </p>
      <p>
        But in the shadows of their sanctity, they marked another as heretic—Kaen, the storm-born prince. His victory in the Crown Prince Tournament was a thunderclap the realm could not ignore: lightning summoned by his own hand, divine and undeniable. Yet the Order called it witchcraft. Their priests cried for his ruin, and Empress Leticia, their most fervent flame, vowed that “no storm prince shall rule.” She spoke of waking what should have stayed buried, a weapon to shatter him.
      </p>
      <p>
        The tale darkens from there. The prince was cast down, his father slain, the Order’s blessing sealing the crime. But death was not Kaen’s end. Returned from shadow with father and grandsire beside him, his vengeance was scripture in its own right: strip the Order of lands, titles, and divine immunity; starve their coffers; silence their priests; and set their temples to the pyre—brick by sacred brick. In his decree, the Order was no longer the empire’s guiding flame, but kindling awaiting the match.
      </p>
      `,
  },
  nicolas: {
    nickname: "The Iron Monarch",
    quote:
      "You whoreson!” Nicolas, a slave overseer with an ugly face and wide shoulders, screamed while running toward the dogs. 'They’re burned!'",
    overview:
      "Nicolas was a 'brutal slave overseer' at Castleberry Farm in Valemyra. He was known for his harsh treatment of the enslaved population, including flogging them. His significant role in the narrative is his **fatal encounter with the reawakened Kaen**. After Kaen accidentally electrocuted Nicolas's hounds, Nicolas attempted to flog him, only to be effortlessly pushed away by Kaen's newfound, unnatural strength, resulting in his neck being snapped. His death marked Kaen's first violent act in his new body and immediately drew attention to his mysterious powers.",
    relations: {
      allies: "Harald (fellow overseer).",
      enemies:
        "Kaen (his killer), and the enslaved individuals he oversaw, such as Jeremiah, who muttered, 'That brute has no soul'.",
    },
    powers: [
      {
        name: "Whip",
        image: "/images/powers/power-2.jpeg",
        overview: "His primary tool for control and punishment.",
      },
    ],
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
    backstory: `
    <p>
    Nicolas was responsible for overseeing the "slaves" at Castleberry Farm, a role he performed with brutality. He owned two large, dark hounds that served him. He was clearly vested in his role and in the control he exerted over the workers, as evidenced by his fury over his dogs and his immediate attempt to punish Kaen.
    </p>
    <p>
    Fateful Encounter with Kaen:<br/>
    Upon Kaen's mysterious reawakening in a new body at Castleberry Farm, he inadvertently killed Nicolas's hounds with a burst of lightning. Enraged, Nicolas lunged at Kaen with a whip, intent on flogging him. However, Kaen, still grappling with his transformed strength, effortlessly caught the whip and with a single "push," sent Nicolas flying into a fence post, snapping his neck and killing him instantly. This shocking death was witnessed by the other workers and immediately stirred whispers of "devil's mark" and "sorcery" around Kaen.
    </p>
    `,
  },
  harald: {
    nickname: "The overseer",
    quote: "Harald’s voice cracked: “Run! Everyone run!",
    overview:
      "Harald was an **overseer at Castleberry Farm** and a colleague of Nicolas. He stepped in to restore order after Kaen's accidental killing of Nicolas, initially attempting to seize Kaen and dismiss his claims of royalty as 'mumbling nonsense'. However, Harald's true nature, and that of the 'slaves' on the farm, was revealed: they were **trained soldiers in a covert military operation**. Witnessing Kaen's uncontrolled lightning powers, Harald reacted with genuine terror, shouting for everyone to flee. He later confirmed to Kaen that the 'farm' was indeed a 'rebellion disguised' and served the Duke.",

    relations: {
      allies:
        "Nicolas (former colleague), Sergeant Anderson, Colonel Merrick, and Duke George's hidden military forces.",

      enemies: "Kaen (initially, due to his perceived threat and strangeness).",
    },
    powers: [
      {
        name: "Whip",
        image: "/images/powers/power-2.jpeg",
        overview: "Carried and used this tool as an overseer.",
      },
      {
        name: "Soldier Training",
        image: "/images/powers/power-2.jpeg",
        overview: "Possessed the skills and discipline of a trained soldier.",
      },
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
    backstory: `
    <p>
    The Overseer and the "Mad Boy":<br/>
    Following Nicolas's death, Harald, as another overseer, took charge. He approached Kaen with questions, attempting to assert authority and dismiss Kaen's claims of being a prince. He believed Kaen was either "possessed by a devil" or "mad". He ordered men to seize Kaen, but they were incapacitated by Kaen's touch.
    </p>
    <p>
    Revelation of the Covert Operation:<br/>
    It was during this confrontation that Kaen, with his military acumen, realized Harald and the "slaves" were actually "trained soldiers". Harald confirmed Kaen's suspicions, admitting that Castleberry was a "hidden war camp" and a "rebellion disguised," stating his loyalty to the Duke. This revelation exposed Duke George's secret military preparations, confirming that Harald was not just a farm overseer but a disciplined soldier following orders in a larger, covert operation.
    </p>
    `,
  },
  "king-of-deep": {
    nickname: "The Abyssal King",
    quote:
      "The King sat regally behind the Queen, his armour dark as the ocean’s depths, crowned with jagged coral and bone. His presence alone commanded absolute authority.",
    overview:
      "The King of the Deep is an ancient ruler who, alongside the Queen of the Deep, is reclaiming lands they held before gods walked Erosea. He commanded absolute authority and was a silent but powerful presence. He and the Queen led monstrous, light-devouring creatures in the 'War of Depths' against the human emperors of Erosea. Their bond is described as a supernaturally coordinated partnership forged before civilization, providing a stark contrast to the disunity of their human adversaries. He was temporarily frozen by Goddess Law's power before vanishing into ash with the Queen",
    powers: [
      {
        name: "Absolute Authority",
        image: "/images/powers/power-2.jpeg",
        overview: "His 'presence alone commanded absolute authority'",
      },
      {
        name: "Command over Deep Creatures",
        image: "/images/powers/power-2.jpeg",
        overview:
          "He leads the creatures that caused devastation, which are described as 'half-human, half-sea' and capable of 'devour[ing] light itself'",
      },
      {
        name: "Supernatural Coordination",
        image: "/images/powers/power-2.jpeg",
        overview:
          "Demonstrates 'supernatural' coordination with the Queen, anticipating her movements",
      },
      {
        name: "Vanishing",
        image: "/images/powers/power-2.jpeg",
        overview:
          "Possessed the ability to turn into ash and vanish, alongside the Queen and their creatures",
      },
    ],
    relations: {
      allies:
        "The Queen of the Deep – His ancient partner, acting in supernatural coordination & His unnamed creatures/beasts",

      enemies:
        "Nemesis: Goddess Law – The divine entity who intervened to stop their invasion and exerted control over them and (Reluctant Allies): The Three Emperors of Erosea: Jarvan the First, Valeon, and Crascius Velathor – They were at war with his forces, eventually uniting against him and the Queen",
    },
    stats: {
      race: "Ancient Being",
      age: "Ancient",
      faction: "The King & Queen of the Deep's forces",
      alignment: "Lawful Evil/Aligned with the Queen of the deep",
      status: "Vanished",
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
      <p>
      Ancient Sovereignty:<br/>
      The King of the Deep, along with the Queen, are ancient rulers of lands held "before gods walked Erosea"
      They emerged from "the deep" to reclaim these territories, leading to widespread environmental devastation across Erosea
      A Partnership Forged in the Abyss: He is consistently depicted as inseparable from the Queen, sitting "regally behind" her.<br/>
      </p>
      <p>
      Under Law's Spell:<br/>
      During Goddess Law's intervention, he, like his forces, was compelled to drop and remain "locked to the ground" by her power
      Their bond is described as a "partnership forged in the abyss of the deep before the dawn of civilization," characterized by supernatural coordination where "when she guides their mount, he anticipates her every shift". This union highlights a profound unity, a quality "the three emperors lack"
      He stayed "still frozen in the dust" even as the Queen broke free of the spell, indicating his stillness or perhaps a different vulnerability to Law's magic compared to the Queen.<br/>
      </p>
      <p>
      Shared Fate: <br/>
      He shared the Queen's ultimate fate, breaking "into ash along with any remaining creature and rode the wind away" in a silent flash
      </p>
      `,
  },
  "queen-of-deep": {
    nickname: "The Fallen Goddess",
    quote: "She was devastatingly beautiful yet alien",
    overview:
      "The Queen of the Deep, ancient sovereign beside her King, seeks to reclaim the realms they ruled before gods walked Erosea. Commanding indescribable sea-spawn that devoured light, she brought devastation—melting mountains, boiling seas, and turning lands to desert—until clashing with the three emperors in the War of Depths. Defiant even before Goddess Law, she chose her fate, her bond with the King as unyielding as the abyss itself.",

    relations: {
      allies:
        "The King of the Deep – Her ancient partner, their bond 'a partnership forged in the abyss of the deep before the dawn of civilization'",

      enemies:
        "Nemesis: Goddess Law – The divine entity who intervened to stop her invasion and tried to force her submission &(Reluctant Allies): The Three Emperors of Erosea: Jarvan the First, Valeon, and Crascius Velathor – They warred against her forces, eventually uniting to drive her back",
    },
    powers: [
      {
        name: "Command over Deep Creatures",
        image: "/images/powers/power-2.jpeg",
        overview:
          "Commands 'monsters' that are 'half-human, half-sea' and 'devoured light itself'",
      },
      {
        name: "Supernatural Coordination",
        image: "/images/powers/power-2.jpeg",
        overview:
          "Possessed the ability to turn into ash and vanish, alongside the Queen and their creatures",
      },
      {
        name: "Corruption/Influence",
        image: "/images/powers/power-2.jpeg",
        overview:
          "Law implied she was corrupted, stating, 'the corruption suits you'",
      },
      {
        name: "black mist",
        image: "/images/powers/power-2.jpeg",
        overview:
          "She could manifest black mist that 'deepened, eating the ground where it touched'",
      },
    ],
    stats: {
      race: "Ancient Being (Fallen Goddess)",
      age: "Ancient",
      faction: "The King & Queen of the Deep's forces",
      alignment: "Chaotic/Self-Serving",
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
    backstory: `
    <p>
      The Queen and King of the Deep were sovereigns of an age before gods walked Erosea, their dominion spanning realms now long claimed by others. When they rose from the abyss, it was not as conquerors, but as heirs reclaiming what had always been theirs. The Queen’s words were calm, almost serene: “I came for what is mine.” Yet the war they waged—the War of Depths—was anything but tranquil. It shattered the world itself: mountains melted, seas boiled, and deserts spread like a slow, festering wound.
    </p>
    <p>
      At the height of the conflict, Goddess Law descended in blinding radiance, her voice an unshakable command for all to kneel. The Queen did not. She shattered the divine spell and regarded the goddess with a voice edged in memory: “All together again. Just like old times.” Law’s reply was cold and telling—“Fallen Goddess Moon. The corruption suits you.” In those words lay the shadow of a great fall, a shared history buried by time. The Queen accused Law of ruling through fear, of orchestrating their doom, and of forcing Memory itself to strip truth from the world. But she, unlike the others, remembered everything.
    </p>
    <p>
      Even as defeat closed in, the Queen’s defiance only deepened. When Jarvan stepped between her and Law, sworn to protect the goddess, she mocked him with the cruel certainty that if he remembered their past, he too would turn his blade against Law. With no path left but surrender, she chose otherwise. Her roar split the air: “I kneel to no one—and I shall choose how I die!” In a blinding flash, she and her King, along with the last of their abyssal kin, dissolved into ash and scattered upon the wind—leaving only the echo of their unyielding will.
    </p>
    `,
  },
};

export { quizData, charactersData };
