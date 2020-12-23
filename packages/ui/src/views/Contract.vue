<template>
	<v-card v-if="contract">
		<v-card-title>
			<h2 class="text-h2">{{ contract.name }}</h2>
		</v-card-title>

		<v-card-subtitle>{{ contract.code }}</v-card-subtitle>

		<v-container>
			<v-row>
				<v-col>
					<v-row>
						<v-col>
							<v-card>
								<v-card-title>Detaily</v-card-title>

								<v-list dense>
									<v-list-item>
										<span>Kód</span>
										<v-spacer />
										<span>{{ contract.code }}</span>
									</v-list-item>

									<v-list-item>
										<span>Popis</span>
										<v-spacer />
										<span>{{ contract.description }}</span>
									</v-list-item>

									<v-list-item>
										<span>Klient</span>
										<v-spacer />
										<span>{{ contract.client.name }}</span>
									</v-list-item>

									<v-list-item>
										<span>Zodpovědný zaměstnanec</span>
										<v-spacer />
										<span>{{ contract.responsibleUser.name }}</span>
									</v-list-item>

									<v-list-item>
										<span>Cena</span>
										<v-spacer />
										<span>{{ contract.price.amount }} {{ contract.price.currency }}</span>
									</v-list-item>
								</v-list>
							</v-card>
						</v-col>
					</v-row>
				</v-col>
				<v-col>
					<v-row>
						<v-col>
							<v-card>
								<v-card-title>Data</v-card-title>

								<v-list dense>
									<v-list-item>
										<span>Deadline</span>
										<v-spacer />
										<span>{{ contract.deadlineAt.toLocaleDateString() }}</span>
									</v-list-item>

									<v-list-item>
										<span>Začátek</span>
										<v-spacer />
										<span>{{ contract.startAt.toLocaleDateString() }}</span>
									</v-list-item>
								</v-list>
							</v-card>
						</v-col>
					</v-row>

					<v-row>
						<v-col>
							<v-card>
								<v-card-title>Dokumentace</v-card-title>

								<v-row v-for="level in contract.levels" :key="level.id" no-gutters>
									<v-col>
										<v-subheader>{{ level.name }}</v-subheader>

										<v-list-item dense>
											<span>Dokončen</span>
											<v-spacer />
											<span>{{ level.isDone ? 'ANO' : 'NE' }}</span>
										</v-list-item>

										<v-list-item dense>
											<span>Deadline</span>
											<v-spacer />
											<span>{{ level.deadlineAt.toLocaleDateString() }}</span>
										</v-list-item>

										<v-list-item dense>
											<span>Začátek</span>
											<v-spacer />
											<span>{{ level.startAt.toLocaleDateString() }}</span>
										</v-list-item>
									</v-col>
								</v-row>
							</v-card>
						</v-col>
					</v-row>
				</v-col>
			</v-row>

			<v-row>
				<v-col>
					<v-card>
						<v-card-title>Komentáře</v-card-title>

						<v-card-text v-if="contract.comments.length < 1"
							>U zakázky nejsou zatím žádné komentáře</v-card-text
						>

						<v-row v-for="comment in contract.comments" :key="comment.id">
							<v-col>
								<v-card>
									<v-card-title>{{ comment.author }}</v-card-title>
									<v-card-text>
										{{ comment.content }}
									</v-card-text>
								</v-card>
							</v-col>
						</v-row>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-card>

	<v-skeleton-loader v-else type="card-heading, table" />
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watchEffect } from '@vue/composition-api';
import { Contract } from '@bokari/shared';
import { getContractById } from '../../mock/data';
import { useRouter } from '@/router';

export default defineComponent({
	name: 'Contract',
	props: {
		id: {
			type: Number,
			required: true
		}
	},
	setup(props) {
		const { id } = toRefs(props);
		const contract = ref<Contract | null>(null);
		const router = useRouter();

		watchEffect(() => {
			setTimeout(() => {
				const foundContract = getContractById(id.value);

				if (!foundContract) {
					return router.push({ name: 'NotFound' });
				}

				contract.value = foundContract;
			}, 1000);
		});

		return {
			contract
		};
	}
});
</script>

<style scoped></style>
