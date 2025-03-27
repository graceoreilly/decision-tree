export type TreeNodeType = {
    id: string
    content: string
    options: {
      text: string
      nextNodeId: string | null
      result?: string
    }[]
  }
  
  export const treeData: Record<string, TreeNodeType> = {
    root: {
      id: "root",
      content: "Anti-fungal therapy",
      options: [
        { text: "Suspected invasive fungal infection?", nextNodeId: "suspected" },
        { text: "Prophylaxis for invasive fungal disease", nextNodeId: "prophylaxis" },
      ],
    },
    suspected: {
      id: "suspected",
      content: "Suspected invasive fungal infection",
      options: [
        { text: "Neonate", nextNodeId: "suspected-neonate" },
        { text: "Older child", nextNodeId: "suspected-older-child" },
      ],
    },
    prophylaxis: {
      id: "prophylaxis",
      content: "Prophylaxis for invasive fungal disease",
      options: [
        { text: "Neonate", nextNodeId: "prophylaxis-neonate" },
        { text: "Older child", nextNodeId: "prophylaxis-older-child" },
      ],
    },
    "suspected-neonate": {
      id: "suspected-neonate",
      content: "Neonate",
      options: [{ text: "Candida suspected or confirmed", nextNodeId: "candida-suspected" }],
    },
    "suspected-older-child": {
      id: "suspected-older-child",
      content: "Older child",
      options: [{ text: "Immunocompromised child", nextNodeId: "immunocompromised-child" }],
    },
    "prophylaxis-neonate": {
      id: "prophylaxis-neonate",
      content: "Neonate",
      options: [
        {
          text: "Refer to neonatal guidelines for prophylaxis in neonates",
          nextNodeId: "neonatal-guidelines",
        },
      ],
    },
    "prophylaxis-older-child": {
      id: "prophylaxis-older-child",
      content: "Older child",
      options: [
        { text: "Immunocompromised child", nextNodeId: "prophylaxis-immunocompromised" },
        { text: "No - consult ID", nextNodeId: null, result: "Consult Infectious Disease specialist for guidance." },
      ],
    },
    "candida-suspected": {
      id: "candida-suspected",
      content: "Candida suspected or confirmed",
      options: [{ text: "Candida localised disease or blood", nextNodeId: "candida-localised" }],
    },
    "immunocompromised-child": {
      id: "immunocompromised-child",
      content: "Immunocompromised child",
      options: [{ text: "Yes", nextNodeId: "immunocompromised-yes" }],
    },
    "neonatal-guidelines": {
      id: "neonatal-guidelines",
      content: "Refer to neonatal guidelines for prophylaxis in neonates (different risk factors to older children)",
      options: [{ text: "Follow American IDSA guidelines", nextNodeId: "idsa-guidelines" }],
    },
    "prophylaxis-immunocompromised": {
      id: "prophylaxis-immunocompromised",
      content: "Immunocompromised child",
      options: [{ text: "Yes", nextNodeId: "prophylaxis-immunocompromised-yes" }],
    },
    "candida-localised": {
      id: "candida-localised",
      content: "Candida localised disease or blood",
      options: [
        { text: "Yes", nextNodeId: "candida-localised-yes" },
        { text: "No", nextNodeId: "candida-localised-no" },
      ],
    },
    "immunocompromised-yes": {
      id: "immunocompromised-yes",
      content: "Yes",
      options: [{ text: "CNS coverage required", nextNodeId: "cns-coverage" }],
    },
    "idsa-guidelines": {
      id: "idsa-guidelines",
      content:
        "Follow American IDSA guidelines: Posaconazole for AML or MDS patients and allogeneic HSCT recipients with GVHD. Fluconazole, posaconazole, or voriconazole for allogeneic HSCT without GVHD. Posaconazole for ALL induction patients. Fluconazole for autologous HSCT recipients with mucositis. Itraconazole or voriconazole for solid organ transplant.",
      options: [
        {
          text: "Implement recommended prophylaxis",
          nextNodeId: null,
          result: "Follow the IDSA guidelines based on the specific patient condition.",
        },
      ],
    },
    "prophylaxis-immunocompromised-yes": {
      id: "prophylaxis-immunocompromised-yes",
      content: "Yes",
      options: [
        {
          text: "Liposomal amphotericin B, micafungin, voriconazole and high risk neutropenic children",
          nextNodeId: "liposomal-amphotericin",
        },
      ],
    },
    "candida-localised-yes": {
      id: "candida-localised-yes",
      content: "Yes",
      options: [
        {
          text: "Fluconazole resistance suspected - consult ID",
          nextNodeId: null,
          result: "Consult Infectious Disease specialist due to suspected Fluconazole resistance.",
        },
      ],
    },
    "candida-localised-no": {
      id: "candida-localised-no",
      content: "No",
      options: [{ text: "Other candida species", nextNodeId: "other-candida" }],
    },
    "cns-coverage": {
      id: "cns-coverage",
      content: "CNS coverage required",
      options: [
        { text: "Yes", nextNodeId: "cns-yes" },
        {
          text: "No",
          nextNodeId: null,
          result:
            "Consider standard antifungal therapy appropriate for the suspected pathogen without CNS penetration requirements.",
        },
      ],
    },
    "liposomal-amphotericin": {
      id: "liposomal-amphotericin",
      content:
        "Liposomal amphotericin B, micafungin, voriconazole and high risk neutropenic children (consider discussing)",
      options: [
        {
          text: "Fluconazole?",
          nextNodeId: null,
          result: "Consider Fluconazole as an alternative option after discussion with specialists.",
        },
      ],
    },
    "other-candida": {
      id: "other-candida",
      content: "Other candida species",
      options: [{ text: "Fluconazole", nextNodeId: "fluconazole-candida" }],
    },
    "cns-yes": {
      id: "cns-yes",
      content: "Yes",
      options: [
        { text: "Cryptococcus", nextNodeId: "cryptococcus" },
        { text: "Site of infection", nextNodeId: "site-of-infection" },
      ],
    },
    "fluconazole-candida": {
      id: "fluconazole-candida",
      content: "Fluconazole",
      options: [{ text: "Candida albicans susceptible to azoles (most Candidiasis)", nextNodeId: "candida-albicans" }],
    },
    cryptococcus: {
      id: "cryptococcus",
      content: "Cryptococcus",
      options: [
        {
          text: "Amphotericin B AND Flucytosine (2-week induction)",
          nextNodeId: "amphotericin-flucytosine",
        },
      ],
    },
    "site-of-infection": {
      id: "site-of-infection",
      content: "Site of infection",
      options: [
        { text: "Pulmonary", nextNodeId: "pulmonary" },
        { text: "Abdominal", nextNodeId: "abdominal" },
        { text: "Eye/sinus", nextNodeId: "eye-sinus" },
        { text: "Skin and soft tissue", nextNodeId: "skin-soft-tissue" },
        { text: "Bone and joint", nextNodeId: "bone-joint" },
        { text: "Febrile neutropenia without source", nextNodeId: "febrile-neutropenia" },
      ],
    },
    "candida-albicans": {
      id: "candida-albicans",
      content: "Candida albicans susceptible to azoles (most Candidiasis)",
      options: [
        {
          text: "Fluconazole OR",
          nextNodeId: null,
          result: "Use Fluconazole for Candida albicans infections that are susceptible to azoles.",
        },
      ],
    },
    "amphotericin-flucytosine": {
      id: "amphotericin-flucytosine",
      content: "Amphotericin B AND Flucytosine (2-week induction)",
      options: [
        {
          text: "Follow guidelines for cryptococcal treatment",
          nextNodeId: null,
          result:
            "Use Amphotericin B AND Flucytosine for 2-week induction phase, then follow guidelines for consolidation and maintenance therapy.",
        },
      ],
    },
    pulmonary: {
      id: "pulmonary",
      content: "Pulmonary",
      options: [{ text: "Aspergillus suspected or confirmed", nextNodeId: "aspergillus" }],
    },
    abdominal: {
      id: "abdominal",
      content: "Abdominal",
      options: [
        {
          text: "Consider broad-spectrum antifungal",
          nextNodeId: null,
          result:
            "For abdominal fungal infections, consider broad-spectrum antifungal therapy based on likely pathogens and local resistance patterns.",
        },
      ],
    },
    "eye-sinus": {
      id: "eye-sinus",
      content: "Eye/sinus",
      options: [
        {
          text: "Consider voriconazole or amphotericin B",
          nextNodeId: null,
          result: "For eye/sinus fungal infections, consider voriconazole or amphotericin B based on likely pathogens.",
        },
      ],
    },
    "skin-soft-tissue": {
      id: "skin-soft-tissue",
      content: "Skin and soft tissue",
      options: [
        {
          text: "Consider local and systemic therapy",
          nextNodeId: null,
          result:
            "For skin and soft tissue fungal infections, consider combination of local and systemic antifungal therapy.",
        },
      ],
    },
    "bone-joint": {
      id: "bone-joint",
      content: "Bone and joint",
      options: [
        {
          text: "Consider surgical consultation",
          nextNodeId: null,
          result:
            "For bone and joint fungal infections, consider surgical consultation in addition to appropriate antifungal therapy.",
        },
      ],
    },
    "febrile-neutropenia": {
      id: "febrile-neutropenia",
      content: "Febrile neutropenia without source",
      options: [
        {
          text: "?",
          nextNodeId: null,
          result:
            "Consult with infectious disease specialists for appropriate empiric antifungal therapy in the setting of febrile neutropenia without a clear source.",
        },
      ],
    },
    aspergillus: {
      id: "aspergillus",
      content: "Aspergillus suspected or confirmed",
      options: [
        {
          text: "Voriconazole",
          nextNodeId: null,
          result: "Use Voriconazole as first-line therapy for suspected or confirmed Aspergillus infections.",
        },
      ],
    },
  }