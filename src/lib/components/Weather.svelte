<script>
    import { onMount, onDestroy, untrack } from 'svelte'
    import WeatherAPI from '../weather-api.js'
    import { settings } from '../settings-store.svelte.js'

    let current = $state(null)
    let loading = $state(false)
    let error = $state(null)
    let initialLoad = $state(true)

    const weatherAPI = new WeatherAPI()

    function handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            loadWeather()
        }
    }

    $effect(() => {
        const lat = settings.latitude
        const lon = settings.longitude
        const tempUnit = settings.tempUnit
        const speedUnit = settings.speedUnit
        const timeFormat = settings.timeFormat

        if (untrack(() => initialLoad)) {
            initialLoad = false
            return
        }

        refreshWeather()
    })

    export async function loadWeather() {
        if (settings.latitude === null || settings.longitude === null) {
            error = 'no latitude or longitude'
            return
        }
        loading = true

        const cached = weatherAPI.getCachedWeather(settings.timeFormat)
        if (cached.data) {
            current = cached.data.current

            if (!cached.isStale) {
                error = null
                loading = false
                return
            }
        }

        try {
            error = null

            const data = await weatherAPI.getWeather(
                settings.latitude,
                settings.longitude,
                settings.tempUnit,
                settings.speedUnit,
                settings.timeFormat
            )

            current = data.current
        } catch (err) {
            error = 'failed to load weather'
            console.error(err)
        } finally {
            loading = false
        }
    }

    export function refreshWeather() {
        weatherAPI.clearCache()
        loadWeather()
    }

    onMount(() => {
        loadWeather()
        document.addEventListener('visibilitychange', handleVisibilityChange)
    })

    onDestroy(() => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
    })
</script>

<div class="panel">
    <button class="widget-label" onclick={refreshWeather} disabled={loading}>
        {loading ? 'loading...' : 'weather'}
    </button>

    {#if error}
        <div class="error">{error}</div>
    {:else if current}
        <div class="temp">{current.temperature_2m}°</div>
        <div class="description">{current.description}</div>
    {/if}
</div>

<style>
    .temp {
        font-size: 3.125rem;
        font-weight: 300;
        color: var(--txt-1);
        line-height: 3.5rem;
        margin: 0 0 0.5rem 0;
    }
    .description {
        font-size: 1.5rem;
        color: var(--txt-3);
        line-height: 2rem;
    }
</style>
