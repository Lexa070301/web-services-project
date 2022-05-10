import dvr from 'mobx-react-form/lib/validators/DVR';
import validatorjs from 'validatorjs';
import MobxReactForm from 'mobx-react-form';
import Swal from 'sweetalert2'
import Agents from "./Agents";
import {toJS} from "mobx";
import Cities from "./Cities";
import {documentsAPI} from "../api/api";
import Contract from "./Contract";
import Contracts from "./Contract";
import Hotels from "./Hotels";

const plugins = {
    dvr: dvr({
        package: validatorjs,
        extend: ({validator, form}) => {
            const messages = validator.getMessages('en');
            messages.required = 'Поле обязательно для заполнения';
            messages.numeric = 'Поле должно содержать только цифры';
            messages.between = 'Поле должно содержать от :min до :max символов';
            messages.regex = 'Поле должно содержать только буквы';
            messages.size = 'Дата должна быть после 1900 года и до сегодняшнего дня';
            validator.setMessages('en', messages);
        }
    }),
};

const organizationHandlers = {
    onChange: (field) => (e) => {
        field.set(e);
        form.$('agent').reset()
        Agents.currentOrganization = e.label
    },
}

const countryHandlers = {
    onChange: (field) => (e) => {
        field.set(e);
        form.$('cities1').reset()
        Cities.currentCountry = e.label
    },
}

const citiesHandlers = {
    onChange: (field) => (e) => {
        field.set(e);
        form.$('hotels1').reset()
        Hotels.currentCities = e.map(city => city.label)
    },
}

const hotelsHandlers = {
    onChange: (field) => (e) => {
        field.set(e);
    },
}

const contractHandlers = {
    onChange: (field) => async (e) => {
        field.set(e);
        await Contract.setCurrentContract(e.value)

        const contract = Contracts.currentContract
        form.$('membersCount').set(contract?.MembersCount)
        form.$('startDate').set(contract?.StartDate)
        form.$('endDate').set(contract?.EndDate)
        if (!contract?.OrganizationId)
            form.$('organization').reset()
        else
            form.$('organization').set({value: contract?.OrganizationId, label: contract?.Organization})
        if (!contract?.EmployeeId)
            form.$('agent').reset()
        else
            form.$('agent').set({value: contract?.EmployeeId, label: contract?.Employee})
        form.$('client').set({value: contract?.ClientId, label: contract?.Client})
        form.$('country').set({value: Contracts.currentCountry.id, label: Contracts.currentCountry.Name})
        form.$('preliminaryAgreement').set({
            value: contract?.PreliminaryAgreementId,
            label: "№ " + contract?.PreliminaryAgreement + " от " + contract?.PreliminaryAgreementDate
        })
    },
}

const fields = [{
    name: 'number',
    label: 'Номер',
    placeholder: 'Введите Номер',
    rules: 'required|numeric',
    type: 'text'
}, {
    name: 'date',
    label: 'Дата',
    placeholder: 'Введите дату',
    rules: 'required',
    type: 'datetime-local',
}, {
    name: 'preliminaryAgreement',
    label: 'Соглашение',
    handlers: contractHandlers,
    placeholder: 'Введите соглашение',
    rules: 'required',
    output: preliminaryAgreement => preliminaryAgreement && preliminaryAgreement.value
}, {
    name: 'organization',
    label: 'Организация',
    rules: 'required',
    handlers: organizationHandlers,
    placeholder: 'Выберите организацию',
    output: organization => organization && organization.value
}, {
    name: 'agent',
    label: 'Агент',
    rules: '',
    placeholder: 'Выберите агента',
    output: agent => agent && agent.value
}, {
    name: 'country',
    label: 'Страна посещения',
    rules: 'required',
    handlers: countryHandlers,
    placeholder: 'Выберите страну',
    output: country => country && country.value
}, {
    name: 'cities1',
    label: 'Города',
    rules: 'required',
    handlers: citiesHandlers,
    placeholder: 'Выберите города',
    output: cities => cities && cities.map(item => toJS(item).value)
}, {
    name: 'hotels1',
    label: 'Отели',
    rules: 'required',
    handlers: hotelsHandlers,
    placeholder: 'Выберите отели',
    output: hotels => hotels && hotels.map(item => toJS(item).value)
}, {
    name: 'members',
    label: 'Участники поездки',
    rules: 'required',
    placeholder: 'Выберите участников поездки',
    output: members => members && members.map(item => toJS(item).value)
}, {
    name: 'client',
    label: 'Клиент',
    rules: 'required',
    placeholder: 'Выберите клиента',
    output: client => client && client.value
}, {
    name: 'membersCount',
    label: 'Количество участников поездки',
    placeholder: 'Количество участников поездки',
    rules: 'required|numeric',
    type: 'text'
}, {
    name: 'startDate',
    label: 'Дата начала',
    placeholder: 'Введите дату',
    rules: 'required|size:10',
    type: 'date',
}, {
    name: 'endDate',
    label: 'Дата окончания',
    placeholder: 'Введите дату',
    rules: 'required|size:10',
    type: 'date',
}];

const hooks = {
    onSuccess(form) {
        const cities = form.values().cities.map(item => toJS(item))
        console.log(cities)
        try {
            documentsAPI.addPreliminaryAgreement(
                form.values().date,
                form.values().number,
                form.values().startDate,
                form.values().endDate,
                form.values().membersCount,
                form.values().agent,
                form.values().organization,
                form.values().client,
                form.values().cities,
            ).then(response => {
                if (response !== "error") {
                    Swal.fire('Success', 'Предварительное соглашение успешно добавлено', 'success')
                } else {
                    Swal.fire('Ошибка', 'Что-то пошло не так', 'error')
                }
            })
        } catch (e) {
            Swal.fire('Ошибка', String(e), 'error')
        }
    },
    onError(form) {
        Swal.fire('Ошибка', 'Введите корректные данные', 'error')
    }
}

export const form = new MobxReactForm({fields}, {plugins, hooks});