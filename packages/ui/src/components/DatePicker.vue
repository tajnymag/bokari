<template>
	<v-dialog
		ref="dialog"
		v-model="modal"
		:disabled="disabled"
		:return-value.sync="date"
		width="290px"
	>
		<template v-slot:activator="{ on, attrs }">
			<v-text-field
				v-model="date"
				v-bind="attrs"
				:flat="flat"
				:label="label"
				:prepend-icon="prependIcon"
				:reverse="reverse"
				:rules="rules"
				:solo="solo"
				readonly
				v-on="on"
			></v-text-field>
		</template>
		<v-date-picker v-model="date" scrollable>
			<v-spacer></v-spacer>
			<v-btn color="primary" text @click="modal = false">Zrušit</v-btn>
			<v-btn color="primary" text @click="confirm">OK</v-btn>
		</v-date-picker>
	</v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from '@vue/composition-api';
import { InputValidationRules } from 'vuetify';

import { VDialogElement } from '../plugins/vuetify';

export default defineComponent({
	name: 'DatePicker',
	props: {
		value: {
			type: String,
			default: new Date().toISOString().substr(0, 10)
		},
		label: {
			type: String,
			default: ''
		},
		rules: {
			type: Array as () => InputValidationRules,
			default: () => []
		},
		prependIcon: {
			type: String,
			default: 'mdi-calendar'
		},
		disabled: {
			type: Boolean,
			default: false
		},
		reverse: {
			type: Boolean,
			default: false
		},
		flat: {
			type: Boolean,
			default: false
		},
		solo: {
			type: Boolean,
			default: false
		}
	},
	setup(props, { emit }) {
		const { value } = toRefs(props);
		const dialog = ref<VDialogElement | null>(null);
		const modal = ref(false);
		const date = ref<string>(new Date(value.value).toISOString().substr(0, 10));

		const confirm = () => {
			dialog.value?.save(date.value);
			emit('input', date.value);
		};

		return {
			date,
			dialog,
			modal,
			confirm
		};
	}
});
</script>

<style scoped></style>
