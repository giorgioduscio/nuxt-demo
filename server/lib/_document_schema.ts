import { object, string, number, array, optional, type InferOutput, union, literal } from 'valibot';


// l'intero documento
export const docSchema = object({
    id: string(),
    title: string(),
    // struttura html
    sections: array(object({
        id: string(),
        className: string(),
        text: string(),

        // contenuto secondario
        sections: array(object({
            id: string(),
            className: string(),
            text: string(),

            // contenuto terziario
            sections: array(object({
                id: string(),
                className: string(),
                text: string(),
                // content: array(contentSchema),
            })),
        })),
    }))
});


// Tipo TypeScript derivato dallo schema
export type Doc = InferOutput<typeof docSchema>;


// esempi di prova
export const testDocs :Doc[] = [
    // PRIMO DOCUMENTO
    {
        id: "qwer-asdf-zxcv",
        title: "Documento di prova",
        sections: [
            {
                id: "a1",
                className: "p-2 border",
                text: "",
                sections: [
                    {
                        id: "a11",
                        className: "btn btn-secondary",
                        text: "Elemento 1",
                        sections: []
                    },
                    {
                        id: "a12",
                        className: "btn btn-primary",
                        text: "Elemento 2",
                        sections: []
                    },
                ]
            },
            {
                id: "b1",
                className: "row",
                text: "",
                sections: [
                    {
                        id: "b11",
                        className: "text-bg-primary col-12 col-sm-6",
                        text: "Elemento 1",
                        sections: []
                    },
                    {
                        id: "b12",
                        className: "text-bg-success col-12 col-sm-6",
                        text: "Elemento 2",
                        sections: []
                    },
                    {
                        id: "b13",
                        className: "text-bg-warning col-12 col-sm-6",
                        text: "Elemento 3",
                        sections: []
                    },
                ]
            },
        ]
    }   
]