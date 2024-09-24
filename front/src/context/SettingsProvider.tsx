import { type Settings, defaultSettings } from '@model/Settings'
import { type ParentProps, type Resource, createContext, createResource, useContext } from 'solid-js'

type SettingsPayload = {
	meta?: {
		generated: string
		source: string
	}
	settings: Partial<Settings>
}

const SettingsContext = createContext<Resource<SettingsPayload>>()

export function SettingsProvider(props: ParentProps) {
	const [content] = createResource<SettingsPayload>(async function f() {
		const response = await fetch('/settings.json')
		if (!response.ok) {
			throw Error('ERR')
		}
		return response.json()
	})
	return <SettingsContext.Provider value={content}>{props.children}</SettingsContext.Provider>
}

export function useSettings() {
	const resource = useContext(SettingsContext)
	if (resource?.state === 'ready') {
		// TODO maybe deepmerge
		return Object.assign({} as Settings, defaultSettings, resource.latest.settings)
	}
	return defaultSettings
}

export function useSetting<K extends keyof Settings>(key: K): Settings[K] {
	return useSettings()[key]
}
