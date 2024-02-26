import discord
from discord.ui import Select
from typing import List, Dict
from discord import SelectOption
from .TextViewerView import TextViewerView

import settings
from localization import loc


def get_emoji(descriptor: str, available: bool, custom_emoji: bool = False) -> str:
    _emoji = loc(f"{descriptor}:emoji") if custom_emoji else f"{descriptor}:emoji"
    bad_names = ["local::unavailable_emoji", "local::available_emoji", "local::unknown_emoji"]
    if _emoji == f"{descriptor}:emoji":
        availability: bool = available
        if availability is not None and availability is False:
            _emoji = loc("local::unavailable_emoji")
        elif availability is not None and availability is True:
            _emoji = loc("local::available_emoji")
        else:
            _emoji = loc("local::unknown_emoji")
        if _emoji in bad_names:
            _emoji = "❓"
    return _emoji


def _extract_options(options: List[Dict], *, custom_emoji: bool = False) -> List[SelectOption]:
    result = []
    for index, option in enumerate(options):
        descriptor_of_option = option.get("descriptor")
        if descriptor_of_option is None:
            settings.logger_errors.error(f"Option {option} has no descriptor!")
            continue
        if descriptor_of_option == "builtins::skip":  # we skip pass, because it's a special case and is displayed as a button
            continue
        _label = f"{loc(f'{descriptor_of_option}:name')}" if option.get("co-descriptor") is None else f"{loc(f'{descriptor_of_option}:name')} ({option['co-descriptor']})"
        result.append(SelectOption(
            label=_label,
            emoji=get_emoji(descriptor_of_option, option.get("available"), custom_emoji=custom_emoji),
            value=str(index)
        ))
    if not result:
        result.append(SelectOption(
            label=loc("builtins::null_action:name"),
            emoji="❓",  # hardcoded to avoid complications with localization (discord will throw error if emoji is not found)
            value="-1"
        ))
    return result


class MenuView(discord.ui.View):
    def __init__(self, input_actions: List[Dict], **kwargs):
        super().__init__(**kwargs)
        self._depth = 0
        self._default_text = kwargs.get("default_text", None)
        self._raw_actions: List[Dict] = input_actions
        self._current_scope: Dict | None = None
        self.final_data: Dict[str, str] | Dict[str, int] = {}
        self.final_data_displayed: Dict[str, str] = {} # this is what given to user. It's a copy of final_data, but with human-readable values

        self._bi_requirements_cache: Dict[str, str] = {}

        self.action_select = Select(placeholder=loc("builtins::turn:action:choice"), custom_id="builtins::action")
        self.action_select.options = _extract_options(self._raw_actions, custom_emoji=True)
        self.action_select.callback = self.action_select_callback

        self.skip_button = discord.ui.Button(label=loc("builtins::skip:name"), style=discord.ButtonStyle.gray)
        self.skip_button.callback = self.skip_callback

        self.exit_button = discord.ui.Button(label=loc("builtins::exit:name"), style=discord.ButtonStyle.red)
        self.exit_button.callback = self.exit_callback

        self.view_option_desc_button = discord.ui.Button(label=loc("local::view_action_desc:name"), style=discord.ButtonStyle.secondary)
        self.view_option_desc_button.callback = self.view_option_desc_callback

        self.add_item(self.action_select)
        self.add_item(self.skip_button)

    async def _update_layout(self, requirements: List[str], interaction: discord.Interaction):
        self.clear_items()

        if requirements == [None]:
            await interaction.message.delete()
            await self.disable_turn()
        if len(requirements) == 1:
            requirement = requirements[0]
            new_select = Select(placeholder=loc("builtins::turn:option:choice"), custom_id=requirement)
            if requirement not in self._current_scope:
                settings.logger_errors.error(f"Requirement {requirement} not found in {self._current_scope}")
                await self._crash_to_menu(interaction)
                return
            new_select.options = _extract_options(self._current_scope[requirement])
            new_select.callback = self.solo_requirement_callback
            self.add_item(new_select)
        elif requirements == ["builtins::line", "builtins::column"]:
            self._bi_requirements_cache = {
                "builtins::line": None,
                "builtins::column": None
            }
            line_select = Select(placeholder=loc("builtins::turn:line:choice"), custom_id="builtins::line")
            column_select = Select(placeholder=loc("builtins::turn:line:choice"), custom_id="builtins::column")
            line_select.options = [SelectOption(label=str(option), value=str(option)) for option in self._current_scope['builtins::line']]
            column_select.options = [SelectOption(label=str(option), value=str(option)) for option in self._current_scope['builtins::column']]
            line_select.callback = self.bi_requirement_callback
            column_select.callback = self.bi_requirement_callback
            self.add_item(line_select)
            self.add_item(column_select)
        else:
            settings.logger_errors.error(f"Requirements {requirements} are not supported!")

        if self._depth == 0:
            self.add_item(self.skip_button)
        else:
            self.add_item(self.view_option_desc_button)
            self.add_item(self.exit_button)

        await interaction.response.edit_message(content=interaction.message.content, view=self)  # noqa

    async def exit_callback(self, interaction: discord.Interaction):
        self._depth = 0
        self.clear_items()
        self.add_item(self.action_select)
        self.add_item(self.skip_button)
        self._current_scope = None
        self.final_data = {}
        self.final_data_displayed = {}
        self._bi_requirements_cache = {}
        await interaction.response.edit_message(content=self._default_text, view=self) # noqa

    async def skip_callback(self, interaction: discord.Interaction):
        self.final_data = {
            "builtins::action": "builtins::skip"
        }
        self.final_data_displayed = {
            "builtins::action": "builtins::skip:name"
        }
        await interaction.message.delete()
        await self.disable_turn()

    async def view_option_desc_callback(self, interaction: discord.Interaction):
        if self._current_scope is None:
            return
        if not isinstance(self._current_scope, dict):
            return
        if self._current_scope.get("requires") == [None] or self._current_scope.get("requires") is None:
            return
        requires = self._current_scope.get("requires")
        requirement = requires[0]
        if requirement not in self._current_scope:
            settings.logger_errors.error(f"Requirement {requirement} not found in {self._current_scope}")
            return
        all_options: str = ""
        for option in self._current_scope[requirement]:
            option_name = f"{option.get('descriptor')}:name"
            option_desc = f"{option.get('descriptor')}:desc"
            option_co_descriptor = option.get("co-descriptor")
            if option_name is None or option_desc is None:
                settings.logger_errors.error(f"Option {option} has no descriptor or description!")
                continue
            loc_option_name = loc(option_name)
            loc_option_desc = loc(option_desc)
            if option_co_descriptor is not None:
                loc_option_name += f" ({option_co_descriptor})"
            emoji = get_emoji(option.get("descriptor"), option.get("available"), custom_emoji=False)
            all_options += f"{emoji} **{loc_option_name}**\n{loc_option_desc}\n\n"
        view_options_view = TextViewerView(all_options,
                                           timeout=60,
                                           color=discord.Colour.dark_blue())
        await interaction.response.send_message(view=view_options_view, embed=view_options_view.get_embed(), ephemeral=True) # noqa

    async def action_select_callback(self, interaction: discord.Interaction):
        index: int = int(interaction.data['values'][0])
        if index == -1:
            self.final_data = {
                "builtins::action": "builtins::skip"
            }
            self.final_data_displayed = {
                "builtins::action": "builtins::skip"
            }
            await interaction.message.delete()
            await self.disable_turn()
        self._depth += 1
        self._default_text = interaction.message.content if self._default_text is None else self._default_text
        self.final_data = {
            "builtins::action": self._raw_actions[index]["descriptor"]
        }
        self.final_data_displayed = {
            "builtins::action": f"{self._raw_actions[index]['descriptor']}:name"
        }

        self._current_scope = self._raw_actions[index]  # setting current scope to the selected action
        requirements: List[str] | List[None] = self._current_scope.get('requires', [None])
        await self._update_layout(requirements, interaction)

    async def solo_requirement_callback(self, interaction: discord.Interaction):
        selected_requirement: str = str(interaction.data['custom_id'])
        index = int(interaction.data['values'][0])
        if index == -1:
            await self.exit_callback(interaction)
            return
        try:
            if self._current_scope[selected_requirement][index].get("available") not in [True, None]:
                await self._crash_to_menu(interaction)
                return
            self.final_data[selected_requirement] = self._current_scope[selected_requirement][index]['id']
            self.final_data_displayed[selected_requirement] = f"{self._current_scope[selected_requirement][index]['descriptor']}:name"
        except KeyError:
            await self._crash_to_menu(interaction)
            return
        await self._handle_callback(interaction, selected_requirement)

    async def bi_requirement_callback(self, interaction: discord.Interaction):
        selected_requirement: str = str(interaction.data['custom_id'])

        if interaction.data['values'][0] == "-1":
            await self.exit_callback(interaction)
            return

        self._bi_requirements_cache[selected_requirement] = interaction.data['values'][0]
        if None in self._bi_requirements_cache.values():
            await interaction.response.defer() # noqa
            return
        try:
            self.final_data.update(self._bi_requirements_cache)
            self.final_data_displayed.update(self._bi_requirements_cache)
        except KeyError:
            await self._crash_to_menu(interaction)
            return
        await interaction.message.delete()
        await self.disable_turn()
        # await self._handle_callback(interaction, selected_requirement)

    async def _handle_callback(self, interaction: discord.Interaction, selected_requirement: str):
        if not isinstance(self._current_scope, dict):
            await interaction.message.delete()
            await self.disable_turn()
            return
        self._current_scope = self._current_scope[selected_requirement][int(interaction.data['values'][0])]
        if not isinstance(self._current_scope, dict):
            await interaction.message.delete()
            await self.disable_turn()
            return
        self._depth += 1
        requirements: List[str] | List[None] = self._current_scope.get('requires', [None])
        if requirements == [None]:
            await interaction.message.delete()
            await self.disable_turn()
        else:
            await self._update_layout(requirements, interaction)

    async def disable_turn(self):
        for child in self.children:
            child.disabled = True
        self.stop()

    async def on_timeout(self) -> None:
        await self.disable_turn()

    async def _crash_to_menu(self, interaction: discord.Interaction):
        await self.exit_callback(interaction)
        settings.logger_errors.error("Crashed to menu")

    def localize_final_data(self) -> str:
        try:
            result: str = ""
            for key, value in self.final_data_displayed.items():
                loc_value = self.final_data_displayed[key] if value in ["1", "2", "3", "4", "5", "6"] else loc(f"{value}")
                localized_key = loc(key)
                if localized_key == f"{key}":
                    localized_key = loc("local::choice")
                localized_key = localized_key.capitalize()
                result += f"{localized_key}: {loc_value}.\n"
            return result
        except Exception as e:
            settings.logger_errors.error(f"Error localizing final data: {e}")
            return ":("
