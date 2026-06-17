<script setup lang=ts>
import { onMounted, ref, watch } from 'vue';
import { getPhysicalOffers } from '../../services/physicalOfferService';
import type { ApiLocale } from '../../types/apiLocale'
import type { PhysicalOffer } from '../../types/physicalOffer'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
  title: string
  mediaType: 'movie' | 'tv'
  locale: ApiLocale
  seasonNumber?: number
}>()

const offers = ref<PhysicalOffer[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

async function loadOffers() {
  if (!props.title) return

  try {
    isLoading.value = true
    error.value = null

    offers.value = await getPhysicalOffers(
      props.title,
      props.mediaType,
      props.locale,
      props.seasonNumber
    )
  } catch (err) {
    console.error(err)
    error.value = 'Impossible de charger les offres.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadOffers)

watch(
  () => [props.title, props.mediaType, props.locale.language, props.locale.countryCode, props.seasonNumber],
  loadOffers
)

</script>

<template>
  <section class="physical-offers">
    <h2>{{ t('offers.title') }}</h2>

    <p v-if="isLoading">{{ t('offers.loading') }}</p>
    <p v-else-if="error" class="error">{{ t('offers.loadError') }}</p>
    <p v-else-if="offers.length === 0">{{ t('offers.noResults') }}</p>

    <div v-else class="offers-list">
        <a
            v-for="offer in offers"
            :key="offer.url"
            :href="offer.url"
            target="_blank"
            rel="noopener noreferrer"
            class="offer-card"
        >
            <div class="offer-image-wrapper">
            <img
                v-if="offer.imageUrl"
                :src="offer.imageUrl"
                :alt="offer.title"
            />
            <div v-else class="offer-placeholder">
                {{ t('offers.noImage') }}
            </div>
            </div>

            <div class="offer-content">
            <h3>{{ offer.title }}</h3>

            <p class="offer-meta">
                {{ offer.provider }}
                <span v-if="offer.format"> · {{ offer.format }}</span>
                <span v-if="offer.condition"> · {{ offer.condition }}</span>
            </p>

            <p class="offer-type">
                {{ offer.offerType }}
            </p>

            <p class="offer-price">
                {{ offer.price }} {{ offer.currency }}
            </p>
            </div>
        </a>
    </div>
  </section>
</template>

<style scoped>

.offers-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1rem;
}

.physical-offers {
  margin-top: 2rem;
}

.physical-offers h2 {
  margin-bottom: 1rem;
}

.offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.offer-card {
  display: flex;
  gap: 1rem;
  min-height: 150px;
  padding: 1rem;
  border-radius: 1rem;
  background: #1f2937;
  color: inherit;
  text-decoration: none;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease;
}

.offer-card:hover {
  transform: translateY(-2px);
  background: #10265e;
  border-color: #3a6fd6;
}

.offer-card img,
.offer-placeholder {
  width: 95px;
  height: 125px;
  flex: 0 0 auto;
  border-radius: 0.65rem;
  overflow: hidden;
  background: #222;
}

.offer-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 0.75rem;
  text-align: center;
}

.offer-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.offer-content h3 {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.offer-meta {
  margin: 0.5rem 0 0;
  color: #b8c4e0;
  font-size: 0.82rem;
}

.offer-type {
  margin: 0.35rem 0 0;
  color: #7eb5ff;
  font-size: 0.78rem;
}

.offer-price {
  margin: auto 0 0;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 800;
}

.offer-info {
  min-width: 0;
}

.offer-info h3 {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.25;
}

.error {
  color: #ff6b6b;
}
</style>