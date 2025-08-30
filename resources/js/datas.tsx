

export const availableDocuments = [
    { 
        type: "Certificate of Indigency", 
        price: 0,
        information: [
            {   
                label: 'Name',
                type: 'text',
                required: true,
                placeholder: 'John Doe',
            },
            {
                label: 'Purpose',
                type: 'select',
                options: ['Educational Assistance', 'Financial Assistance', 'Medical Assistance'],
                required: true,
                placeholder: 'Select a purpose',
            },
            {
                label: 'Sitio',
                type: 'select',
                options: ['Matictic', 'Kanyakan', 'Gulod', 'Coral', 'Proper', 'Padling', 'Dynamite'],
                required: true,
                placeholder: 'Select a sitio',
            }
        ]
    }, 
    { 
        type: "Certificate of Residency", 
        price: 0,
        information: [
            {  
                label: 'Name',
                type: 'text',
                required: true,
                placeholder: 'John Doe',
            },
            {
                label: 'Civil_Status',
                type: 'select',
                options: ['Single', 'Married', 'Divorced', 'Widowed'],
                required: true,
                placeholder: 'Select a civil status',
            },
            {
                label: 'Sitio',
                type: 'select',
                options: ['Matictic', 'Kanyakan', 'Gulod', 'Coral', 'Proper', 'Padling', 'Dynamite'],
                required: true,
                placeholder: 'Select a sitio',
            }
        ]
    }
];


export const shippingFee = 50;