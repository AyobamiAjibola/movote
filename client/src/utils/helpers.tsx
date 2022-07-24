export const phonePattern = /^[/+]?[(]?[0-9]{3}[)]?[-\s/.]?[0-9]{3}[-\s/.]?[0-9]{4,9}$/;
export const emailPattern = /^\w+([/.-]?\w+)*@\w+([/.-]?\w+)*(\.\w{2,3})+$/;
export const currencyPattern = /^-?\d+(,\d{3})*(\.\d{1,2})?$/;
export const password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export const defaultValues = {
        fname: '',
        lname: '',
        address: '',
        phone_num: '',
        gender: '',
        status: ''
};

export const loginValues = {
        email: '',
        password: ''
}

export const regValues = {
        email: '',
        company: '',
        contestName: '',
        isAdmin: '',
        description: '',
        password: '',
        confirm_password: ''
}

export const contestantValue = {
        fname: '',
        lname: '',
        username: ''
}