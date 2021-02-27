<template>
	<v-card>
		<v-card-title>{{ user.person.name }}</v-card-title>
		<v-card-subtitle>{{ user.username }}</v-card-subtitle>

		<v-container>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>Kontakty</v-card-title>

						<v-list two-line>
							<v-list-item-group v-for="contact in user.contacts" :key="contact.id">
								<v-list-item v-if="contact.email">
									<v-list-item-icon>
										<v-icon>mdi-email</v-icon>
									</v-list-item-icon>

									<v-list-item-content>
										<v-list-item-title>
											{{ contact.email }}
										</v-list-item-title>
										<v-list-item-subtitle>E-mail</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>

								<v-list-item v-if="contact.phone">
									<v-list-item-icon>
										<v-icon>mdi-phone</v-icon>
									</v-list-item-icon>

									<v-list-item-content>
										<v-list-item-title>{{ contact.phone }}</v-list-item-title>
										<v-list-item-subtitle>Telefon</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>

								<v-list-item v-if="contact.address">
									<v-list-item-icon>
										<v-icon>mdi-map-marker</v-icon>
									</v-list-item-icon>

									<v-list-item-content>
										<v-list-item-title>
											{{ contact.address.street }}, {{ contact.address.city }},
											{{ contact.address.zip }},
											{{ contact.address.country }}
										</v-list-item-title>
										<v-list-item-subtitle>Adresa</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>

								<v-list-item v-if="contact.email">
									<v-list-item-icon>
										<v-icon>mdi-email</v-icon>
									</v-list-item-icon>

									<v-list-item-content>
										{{ contact.email }}
									</v-list-item-content>
								</v-list-item>
							</v-list-item-group>
						</v-list>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-card>
</template>

<script lang="ts">
import { User } from '@bokari/api-client';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
	name: 'UserCard',
	props: {
		user: {
			type: Object as () => User,
			required: true
		}
	}
});
</script>

<style scoped></style>
