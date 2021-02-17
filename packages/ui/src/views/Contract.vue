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
										<span>{{ contract.customer.person.name }}</span>
									</v-list-item>

									<v-list-item>
										<span>Vytvořil</span>
										<v-spacer />
										<span>{{ contract.metadata.createdBy.username }}</span>
									</v-list-item>

									<v-list-item>
										<span>Cena</span>
										<v-spacer />
										<span>
											{{ contract.price.value }}
											{{ contract.price.currency.iso }}
										</span>
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
										<span>{{ contract.deadlineAt }}</span>
									</v-list-item>

									<v-list-item>
										<span>Začátek</span>
										<v-spacer />
										<span>{{ contract.startAt }}</span>
									</v-list-item>
								</v-list>
							</v-card>
						</v-col>
					</v-row>

					<v-row>
						<v-col>
							<v-card>
								<v-card-title>Dokumentace</v-card-title>

								<v-row
									v-for="contractPhase in contract.contractPhases"
									:key="contractPhase.id"
									no-gutters
								>
									<v-col>
										<v-subheader>{{ contractPhase.phase.name }}</v-subheader>

										<v-list-item dense>
											<span>Dokončen</span>
											<v-spacer />
											<span>{{ contractPhase.isDone ? 'ANO' : 'NE' }}</span>
										</v-list-item>

										<v-list-item dense>
											<span>Deadline</span>
											<v-spacer />
											<span>
												{{ contractPhase.deadlineAt }}
											</span>
										</v-list-item>

										<v-list-item dense>
											<span>Začátek</span>
											<v-spacer />
											<span>
												{{ contractPhase.startAt }}
											</span>
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
						<v-card-title>Přílohy</v-card-title>

						<v-card-text v-if="contract.attachments.length < 1">
							U zakázky nejsou zatím žádné přílohy
						</v-card-text>

						<v-row v-for="attachment in contract.attachments" :key="attachment.id">
							<v-col>
								<v-card>
									<v-card-title>
										{{ attachment.metadata.createdBy.username }}
									</v-card-title>
									<v-card-text>
										{{ attachment.note }}
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
import { useRouter } from '@/router';
import { Contract } from '@bokari/api-client';
import { contractsAPIClient } from '@/http/api';

export default defineComponent({
	name: 'Contract',
	props: {
		contractCode: {
			type: String,
			required: true
		}
	},
	setup(props) {
		const { contractCode } = toRefs(props);
		const contract = ref<Contract | null>(null);
		const router = useRouter();

		watchEffect(() => {
			contractsAPIClient
				.getContractByCode(contractCode.value)
				.then((res) => {
					contract.value = res.data;
				})
				.catch(() => {
					router.push({ name: 'NotFound' });
				});
		});

		return {
			contract
		};
	}
});
</script>

<style scoped></style>
